import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

function Navbar() {
  const navigate = useNavigate();

  const { user, logoutUser } = useAuthStore();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    setIsMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="text-xl font-bold text-gray-800"
          >
            Stripe E-Commerce
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">

            <Link
              to="/products"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Products
            </Link>

            <Link
              to="/cart"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Cart
            </Link>

            <Link
              to="/orders"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              My Orders
            </Link>

            {user && (
              <span className="text-gray-600">
                Hi, {user.name}
              </span>
            )}

            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>

          {/* Hamburger Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              // X icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // Hamburger icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">

            <div className="flex flex-col gap-4">

              <Link
                to="/products"
                onClick={closeMenu}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Products
              </Link>

              <Link
                to="/cart"
                onClick={closeMenu}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Cart
              </Link>

              <Link
                to="/orders"
                onClick={closeMenu}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                My Orders
              </Link>

              {user && (
                <span className="text-gray-600">
                  Hi, {user.name}
                </span>
              )}

              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-full sm:w-auto"
              >
                Logout
              </button>

            </div>
          </div>
        )}

      </div>
    </header>
  );
}

export default Navbar;

