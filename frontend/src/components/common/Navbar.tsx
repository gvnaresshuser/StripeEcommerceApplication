import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

function Navbar() {
  const navigate = useNavigate();

  const { user, logoutUser } = useAuthStore();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-gray-800">
          Stripe E-Commerce
        </Link>

        <div className="flex items-center gap-4">
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

          {user && <span className="text-gray-600">Hi, {user.name}</span>}

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
