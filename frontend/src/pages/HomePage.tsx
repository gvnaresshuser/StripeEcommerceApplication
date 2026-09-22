import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import Navbar from "../components/common/Navbar";

function HomePage() {
  const navigate = useNavigate();

  const { user, isAuthenticated, loading, fetchMe } = useAuthStore();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  // --------------------------------
  // Loading
  // --------------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin"></div>

          <p className="mt-4 text-sm font-medium text-gray-600">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 text-white">
            <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">
              Dashboard
            </p>

            <h1 className="mt-2 text-3xl sm:text-4xl font-bold">
              Welcome, {user.name}! 👋
            </h1>

            <p className="mt-3 text-blue-100 text-base">
              Welcome to your Stripe E-Commerce account.
            </p>
          </div>

          {/* Account Information */}
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Account Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Your authenticated account details
                </p>
              </div>

              {/* Authenticated Badge */}
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Authenticated
              </span>
            </div>

            {/* User Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* User ID */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  User ID
                </p>

                <p className="mt-2 text-lg font-semibold text-gray-800">
                  #{user.id}
                </p>
              </div>

              {/* Name */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Name
                </p>

                <p className="mt-2 text-lg font-semibold text-gray-800">
                  {user.name}
                </p>
              </div>

              {/* Email */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Email Address
                </p>

                <p className="mt-2 text-lg font-semibold text-gray-800 break-all">
                  {user.email}
                </p>
              </div>

              {/* Role */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Role
                </p>

                <span className="inline-flex mt-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                  {user.role}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Quick Actions
              </h3>

              <div className="mt-4 flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/products")}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-sm"
                >
                  Browse Products
                </button>

                <button
                  onClick={() => navigate("/cart")}
                  className="px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  View Cart
                </button>

                <button
                  onClick={() => navigate("/orders")}
                  className="px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  My Orders
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Securely authenticated using JWT and HttpOnly cookies.
          </p>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
