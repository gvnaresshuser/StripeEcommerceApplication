import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getUserOrders, type UserOrder } from "../api/orderApi";
import Navbar from "../components/common/Navbar";

function MyOrdersPage() {
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getUserOrders();

        setOrders(data);
      } catch (error: any) {
        console.error("Failed to load orders:", error);

        setError(
          error.response?.data?.message || "Unable to load your orders.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const paidOrders = orders.filter(
    (order) => order.status === "PAID" && order.paymentStatus === "SUCCEEDED",
  ).length;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    if (status === "PAID") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-200">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          Paid
        </span>
      );
    }

    if (status === "PENDING") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-200">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Pending
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 ring-1 ring-inset ring-gray-200">
        {status}
      </span>
    );
  };

  const getPaymentBadge = (paymentStatus: string) => {
    if (paymentStatus === "SUCCEEDED") {
      return (
        <span className="font-semibold text-green-600">Payment Successful</span>
      );
    }

    if (paymentStatus === "PENDING") {
      return (
        <span className="font-semibold text-amber-600">Payment Pending</span>
      );
    }

    return <span className="font-semibold text-gray-600">{paymentStatus}</span>;
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center px-4">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

            <p className="text-sm font-medium text-gray-600">
              Loading your orders...
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center px-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-xl font-bold text-red-600">
              !
            </div>

            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              Unable to Load Orders
            </h1>

            <p className="mb-6 text-sm leading-6 text-gray-500">{error}</p>

            <Link
              to="/products"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Continue Shopping
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
              Account
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              My Orders
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              View your order history and payment information.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Summary Cards */}
        {orders.length > 0 && (
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Total Orders</p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {orders.length}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Successful Payments
              </p>

              <p className="mt-1 text-2xl font-bold text-green-600">
                {paidOrders}
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-2xl">
              🛍️
            </div>

            <h2 className="text-2xl font-bold text-gray-900">No Orders Yet</h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              You haven't placed any orders yet. Explore our products and place
              your first order.
            </p>

            <Link
              to="/products"
              className="mt-7 inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          /* Orders */
          <div className="space-y-5">
            {orders.map((order) => (
              <article
                key={order.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
              >
                {/* Order Header */}
                <div className="border-b border-gray-200 bg-gray-50/70 px-5 py-5 sm:px-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-lg font-bold text-gray-900">
                          Order #{order.id}
                        </h2>

                        {getStatusBadge(order.status)}
                      </div>

                      <p className="mt-1.5 text-sm text-gray-500">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Order Total
                      </p>

                      <p className="mt-0.5 text-2xl font-bold text-gray-900">
                        ₹{Number(order.totalAmount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Information */}
                <div className="px-5 py-5 sm:px-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Order Status */}
                    <div className="rounded-xl border border-gray-200 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Order Status
                      </p>

                      <p className="mt-2 text-sm font-semibold text-gray-800">
                        {order.status}
                      </p>
                    </div>

                    {/* Payment Status */}
                    <div className="rounded-xl border border-gray-200 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Payment Status
                      </p>

                      <div className="mt-2 text-sm">
                        {getPaymentBadge(order.paymentStatus)}
                      </div>
                    </div>
                  </div>

                  {/* Stripe Payment */}
                  {order.stripePaymentIntentId && (
                    <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Payment Reference
                      </p>

                      <p className="mt-2 break-all font-mono text-xs text-gray-600">
                        {order.stripePaymentIntentId}
                      </p>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default MyOrdersPage;
