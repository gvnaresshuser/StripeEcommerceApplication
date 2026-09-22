import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getProduct, type Product } from "../api/productApi";
import useCartStore from "../store/cartStore";

function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();

  // Zustand cart store
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<Product | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  // ================================
  // ADD PRODUCT TO LOCAL CART
  // ================================
  const handleAddToCart = () => {
    if (!product) {
      return;
    }

    setAddingToCart(true);
    setCartMessage("");

    addItem({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      imageUrl: product.imageUrl,
      quantity: 1,
    });

    setCartMessage("Product added to cart successfully.");

    setAddingToCart(false);
  };

  // ================================
  // LOAD PRODUCT
  // ================================
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setError("Product ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const data = await getProduct(Number(id));

        setProduct(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // ================================
  // LOADING
  // ================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading product...</p>
      </div>
    );
  }

  // ================================
  // ERROR
  // ================================
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>

          <Link to="/products" className="text-blue-600 hover:underline">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // ================================
  // PRODUCT NOT FOUND
  // ================================
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Product not found.</p>
      </div>
    );
  }

  // ================================
  // UI
  // ================================
  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/products" className="text-blue-600 hover:underline">
            ← Back to Products
          </Link>

          <Link
            to="/cart"
            className="text-blue-600 font-semibold hover:underline"
          >
            View Cart
          </Link>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* PRODUCT IMAGE */}
            <div>
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full min-h-[400px] object-cover"
                />
              ) : (
                <div className="w-full min-h-[400px] bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
            </div>

            {/* PRODUCT INFORMATION */}
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-800">
                {product.name}
              </h1>

              <p className="mt-6 text-gray-600 leading-relaxed">
                {product.description}
              </p>

              {/* PRICE */}
              <div className="mt-8">
                <p className="text-3xl font-bold text-gray-900">
                  ${Number(product.price).toFixed(2)}
                </p>
              </div>

              {/* STOCK */}
              <div className="mt-4">
                <p className="text-gray-600">
                  Available Stock:{" "}
                  <span className="font-semibold">{product.stock}</span>
                </p>
              </div>

              {/* ADD TO CART */}
              <div className="mt-8">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart || product.stock <= 0}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {addingToCart
                    ? "Adding..."
                    : product.stock <= 0
                      ? "Out of Stock"
                      : "Add to Cart"}
                </button>
              </div>

              {/* SUCCESS MESSAGE */}
              {cartMessage && (
                <p className="mt-4 text-center text-green-600 font-medium">
                  {cartMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProductDetailsPage;
