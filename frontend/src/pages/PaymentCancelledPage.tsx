import { Link } from "react-router-dom";

function PaymentCancelledPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6">
      <div className="bg-white rounded-xl shadow-lg p-10 max-w-lg w-full text-center">
        <div className="text-yellow-500 text-5xl">!</div>

        <h1 className="mt-6 text-3xl font-bold text-gray-800">
          Payment Cancelled
        </h1>

        <p className="mt-4 text-gray-600">
          Your Stripe payment was cancelled. Your cart has not been cleared, so
          you can return and try again.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            to="/cart"
            className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Return to Cart
          </Link>

          <Link to="/products" className="text-blue-600 hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PaymentCancelledPage;
