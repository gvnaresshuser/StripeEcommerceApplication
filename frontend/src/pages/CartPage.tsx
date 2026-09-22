import { useState } from "react";
import { Link } from "react-router-dom";

import { createCheckoutOrder } from "../api/orderApi";
import useCartStore from "../store/cartStore";
import { createCheckoutSession } from "../api/paymentApi";
import Navbar from "../components/common/Navbar";
function CartPage() {
  // ================================
  // ZUSTAND CART
  // ================================

  const items = useCartStore((state) => state.items);

  const removeItem = useCartStore((state) => state.removeItem);

  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const clearCart = useCartStore((state) => state.clearCart);

  // ================================
  // CHECKOUT STATE
  // ================================

  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const [checkoutError, setCheckoutError] = useState("");

  // ================================
  // CART TOTALS
  // ================================

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const totalAmount = items.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );

  // ================================
  // CHECKOUT
  // ================================

const handleCheckout = async () => {
  if (items.length === 0) {
    return;
  }

  try {
    setCheckoutLoading(true);
    setCheckoutError("");

    // =====================================
    // STEP 1: CREATE ORDER
    // =====================================

    const checkoutItems = items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    const orderResult = await createCheckoutOrder(checkoutItems);

    console.log("Order created:", orderResult);

    const orderId = orderResult.order.id;

    // =====================================
    // STEP 2: CREATE STRIPE CHECKOUT SESSION
    // =====================================

    const paymentResult = await createCheckoutSession(orderId);

    console.log("Stripe Checkout Session created:", paymentResult);

    // =====================================
    // STEP 3: REDIRECT TO STRIPE
    // =====================================

    window.location.href = paymentResult.checkoutUrl;
  } catch (error: any) {
    console.error("Checkout error:", error);

    setCheckoutError(
      error.response?.data?.message || "Unable to proceed to checkout.",
    );
  } finally {
    setCheckoutLoading(false);
  }
};

  // ================================
  // RENDER
  // ================================

  return (
    <div className="min-h-screen bg-gray-100">
      {/* =================================
          HEADER
      ================================= */}
      <Navbar />

      {/*  <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">My Cart</h1>

          <Link to="/products" className="text-blue-600 hover:underline">
            Continue Shopping
          </Link>
        </div>
      </header> */}

      {/* =================================
          MAIN
      ================================= */}

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* =================================
            EMPTY CART
        ================================= */}

        {items.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              Your cart is empty
            </h2>

            <p className="mt-3 text-gray-500">
              Add some products to your cart to get started.
            </p>

            <Link
              to="/products"
              className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          /* =================================
             CART WITH ITEMS
          ================================= */

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* =================================
                CART ITEMS
            ================================= */}

            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="bg-white rounded-xl shadow p-6"
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* =================================
                        IMAGE
                    ================================= */}

                    <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-400">No Image</span>
                        </div>
                      )}
                    </div>

                    {/* =================================
                        PRODUCT INFORMATION
                    ================================= */}

                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-800">
                        {item.name}
                      </h2>

                      <p className="mt-2 text-gray-600">
                        ${Number(item.price).toFixed(2)}
                      </p>

                      {/* =================================
                          QUANTITY
                      ================================= */}

                      <div className="mt-4 flex items-center gap-3">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="w-9 h-9 border rounded-lg hover:bg-gray-100"
                        >
                          −
                        </button>

                        <span className="w-10 text-center font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="w-9 h-9 border rounded-lg hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>

                      {/* =================================
                          REMOVE
                      ================================= */}

                      <button
                        onClick={() => removeItem(item.productId)}
                        className="mt-4 text-red-600 text-sm hover:underline"
                      >
                        Remove
                      </button>
                    </div>

                    {/* =================================
                        SUBTOTAL
                    ================================= */}

                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-800">
                        ${(Number(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* =================================
                  CLEAR CART
              ================================= */}

              <div className="text-right">
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:underline"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* =================================
                ORDER SUMMARY
            ================================= */}

            <div>
              <div className="bg-white rounded-xl shadow p-6 sticky top-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Order Summary
                </h2>

                <div className="mt-6 space-y-3">
                  {/* ITEMS */}

                  <div className="flex justify-between">
                    <span className="text-gray-600">Items</span>

                    <span className="font-semibold">{totalItems}</span>
                  </div>

                  {/* TOTAL */}

                  <div className="border-t pt-3 flex justify-between">
                    <span className="text-lg font-semibold">Total</span>

                    <span className="text-xl font-bold">
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* =================================
                    CHECKOUT ERROR
                ================================= */}

                {checkoutError && (
                  <p className="mt-4 text-sm text-red-600">{checkoutError}</p>
                )}

                {/* =================================
                    CHECKOUT BUTTON
                ================================= */}

                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {checkoutLoading
                    ? "Creating Order..."
                    : "Proceed to Checkout"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default CartPage;
