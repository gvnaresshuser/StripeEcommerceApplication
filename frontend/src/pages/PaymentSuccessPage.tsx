import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { getUserOrders } from "../api/orderApi";
import useCartStore from "../store/cartStore";

function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();

  const sessionId = searchParams.get("session_id");

  const clearCart = useCartStore((state) => state.clearCart);

  const [checking, setChecking] = useState(true);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setChecking(false);
      setError("Stripe session ID is missing.");
      return;
    }

    let cancelled = false;

    const verifyPayment = async () => {
      const maxAttempts = 15;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const orders = await getUserOrders();

          const order = orders.find(
            (item) => item.stripeSessionId === sessionId,
          );

          if (
            order &&
            order.status === "PAID" &&
            order.paymentStatus === "SUCCEEDED"
          ) {
            if (!cancelled) {
              setOrderId(order.id);
              setPaymentConfirmed(true);
              setChecking(false);

              // Clear local Zustand cart only after
              // backend confirms successful payment.
              clearCart();
            }

            return;
          }
        } catch (err) {
          console.error("Payment verification error:", err);
        }

        // Give the Stripe webhook some time to update the database.
        if (attempt < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      if (!cancelled) {
        setChecking(false);
        setError(
          "Payment was completed, but order confirmation is taking longer than expected. Please check your orders.",
        );
      }
    };

    verifyPayment();

    return () => {
      cancelled = true;
    };
  }, [sessionId, clearCart]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-lg w-full text-center">
        {checking && (
          <>
            <div className="text-blue-600 text-5xl mb-4">⏳</div>

            <h1 className="text-2xl font-bold mb-3">Confirming Payment...</h1>

            <p className="text-gray-600">
              Stripe has returned you to our application. We are confirming your
              payment with the backend.
            </p>

            <p className="text-sm text-gray-500 mt-4">Please wait...</p>
          </>
        )}

        {!checking && paymentConfirmed && (
          <>
            <div className="text-green-600 text-6xl mb-4">✓</div>

            <h1 className="text-3xl font-bold text-green-700 mb-3">
              Payment Successful
            </h1>

            <p className="text-gray-600 mb-4">
              Your payment has been successfully confirmed.
            </p>

            {orderId && (
              <p className="font-semibold text-gray-800 mb-4">
                Order #{orderId}
              </p>
            )}

            {sessionId && (
              <div className="bg-gray-100 rounded p-3 mb-6 text-left">
                <p className="text-xs text-gray-500 mb-1">Stripe Session ID</p>

                <p className="text-xs break-all text-gray-700">{sessionId}</p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <Link
                to="/products"
                className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
              >
                Continue Shopping
              </Link>

              <Link
                to="/"
                className="border border-gray-300 px-6 py-3 rounded hover:bg-gray-50"
              >
                Go to Home
              </Link>
            </div>
          </>
        )}

        {!checking && !paymentConfirmed && error && (
          <>
            <div className="text-yellow-600 text-5xl mb-4">!</div>

            <h1 className="text-2xl font-bold mb-3">
              Payment Confirmation Pending
            </h1>

            <p className="text-gray-600 mb-6">{error}</p>

            <div className="flex flex-col gap-3">
              <Link
                to="/products"
                className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
              >
                Continue Shopping
              </Link>

              <Link
                to="/"
                className="border border-gray-300 px-6 py-3 rounded hover:bg-gray-50"
              >
                Go to Home
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PaymentSuccessPage;
