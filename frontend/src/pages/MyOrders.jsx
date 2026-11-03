

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Package,
  ShoppingBag,
} from "lucide-react";

import { getMyOrders } from "../services/orderApi";

const PAGE_SIZE = 5;

const statusStyles = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-blue-50 text-blue-700",
  processing: "bg-purple-50 text-purple-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
  returned: "bg-gray-100 text-gray-700",
};

function formatPrice(amount) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [totalPages, setTotalPages] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      try {
        setLoading(true);
        setError("");

        const data = await getMyOrders(page, PAGE_SIZE);

        if (!active) return;

        setOrders(data.orders || []);
        setTotalPages(data.pagination?.totalPages || 0);
        setTotalOrders(data.pagination?.totalOrders || 0);
      } catch (err) {
        if (!active) return;

        setOrders([]);
        setError(
          err.response?.data?.message ||
            "Unable to load your orders. Please try again."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadOrders();

    return () => {
      active = false;
    };
  }, [page]);

  function handlePreviousPage() {
    if (loading || page <= 1) return;

    setPage((current) => current - 1);
  }

  function handleNextPage() {
    if (loading || page >= totalPages) return;

    setPage((current) => current + 1);
  }

  const startOrder =
    totalOrders === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;

  const endOrder = Math.min(
    page * PAGE_SIZE,
    totalOrders
  );

  return (
    <section className="min-h-[75vh] bg-ivory px-5 py-12 sm:px-8 lg:py-16">
      <div className="mx-auto max-w-4xl">

        {/* Page Heading */}
        <div className="mb-9 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-taupe">
            Threads & Tassels
          </p>

          <h1 className="font-serif text-4xl text-chocolate sm:text-5xl">
            My Orders
          </h1>

          <div className="mx-auto mt-5 h-px w-16 bg-gold" />

          <p className="mt-5 text-sm text-taupe">
            Your purchases and their delivery progress.
          </p>
        </div>

        {/* Total Order Count */}
        {!loading && !error && (
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm font-medium text-chocolate">
              Order History
            </p>

            <span className="rounded-full border border-[#EAE2D8] bg-offwhite px-3 py-1.5 text-xs text-taupe">
              {totalOrders}{" "}
              {totalOrders === 1 ? "Order" : "Orders"}
            </span>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div
            className="rounded-2xl border border-[#EAE2D8] bg-offwhite py-16 text-center"
            role="status"
          >
            <div className="mx-auto mb-4 h-7 w-7 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />

            <p className="text-sm text-taupe">
              Loading your orders...
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-offwhite px-6 py-12 text-center">
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() => setPage((current) => current === 1 ? 0 : 1)}
              className="mt-5 text-sm font-medium text-chocolate underline underline-offset-4 hover:text-gold"
            >
              Go to First Page
            </button>
          </div>
        )}

        {/* No Orders Yet */}
        {!loading && !error && totalOrders === 0 && (
          <div className="rounded-2xl border border-[#EAE2D8] bg-offwhite px-6 py-12 text-center sm:p-14">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ivory">
              <ShoppingBag
                size={30}
                strokeWidth={1.5}
                className="text-gold"
              />
            </div>

            <h2 className="mt-6 font-serif text-2xl text-chocolate">
              No Orders Yet
            </h2>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-taupe">
              You haven't placed any orders yet.
              Explore our collection and find something beautiful.
            </p>

            <Link
              to="/products"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-chocolate px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gold"
            >
              Explore Products
              <ChevronRight size={17} />
            </Link>
          </div>
        )}

        {/* Empty Page (but customer has other orders) */}
        {!loading &&
          !error &&
          totalOrders > 0 &&
          orders.length === 0 && (
            <div className="rounded-2xl border border-[#EAE2D8] bg-offwhite px-6 py-12 text-center">
              <Package
                size={30}
                className="mx-auto text-gold"
              />

              <h2 className="mt-5 font-serif text-xl text-chocolate">
                No Orders on This Page
              </h2>

              <p className="mt-3 text-sm text-taupe">
                Try returning to the first page.
              </p>

              <button
                type="button"
                onClick={() => setPage(1)}
                className="mt-5 rounded-xl bg-chocolate px-5 py-3 text-sm text-white transition-colors hover:bg-gold"
              >
                First Page
              </button>
            </div>
          )}

        {/* Orders Listing */}
        {!loading && !error && orders.length > 0 && (
          <>
            <div className="space-y-4">
              {orders.map((order) => {
                const isPaid =
                  order.paymentStatus === "paid";

                const statusText = isPaid
                  ? order.orderStatus
                  : `Payment ${order.paymentStatus}`;

                const statusClass = isPaid
                  ? statusStyles[order.orderStatus] ||
                    "bg-gray-100 text-gray-700"
                  : "bg-amber-50 text-amber-700";

                const itemCount =
                  order.items?.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  ) || 0;

                return (
                  <div
                    key={order._id}
                    className="rounded-2xl border border-[#EAE2D8] bg-offwhite p-5 shadow-[0_5px_20px_rgba(74,46,31,0.03)] transition-colors hover:border-gold/50 sm:p-6"
                  >
                    {/* Order Header */}
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Package
                            size={18}
                            className="shrink-0 text-gold"
                          />

                          <p className="text-sm font-semibold text-chocolate">
                            Order #
                            {order._id
                              .slice(-8)
                              .toUpperCase()}
                          </p>
                        </div>

                        <p className="mt-2 text-xs text-taupe">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize ${statusClass}`}
                      >
                        {statusText}
                      </span>
                    </div>

                    {/* Order Footer */}
                    <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-[#EAE2D8] pt-4">
                      <div>
                        <p className="text-xs text-taupe">
                          {itemCount}{" "}
                          {itemCount === 1
                            ? "item"
                            : "items"}
                        </p>

                        <p className="mt-1 text-xl font-semibold text-chocolate">
                          {formatPrice(order.totalAmount)}
                        </p>
                      </div>

                      <Link
                        to={`/account/orders/${order._id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-chocolate transition-colors hover:text-gold"
                      >
                        View Details
                        <ChevronRight size={17} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex flex-col items-center gap-4 border-t border-[#EAE2D8] pt-7 sm:flex-row sm:justify-between">
                <p className="text-xs text-taupe">
                  Showing {startOrder}–{endOrder} of{" "}
                  {totalOrders} orders
                </p>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handlePreviousPage}
                    disabled={loading || page === 1}
                    className="rounded-lg border border-[#EAE2D8] bg-offwhite px-4 py-2.5 text-sm text-chocolate transition-colors hover:border-gold hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <span className="min-w-[65px] text-center text-xs text-taupe">
                    {page} of {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={loading || page >= totalPages}
                    className="rounded-lg border border-[#EAE2D8] bg-offwhite px-4 py-2.5 text-sm text-chocolate transition-colors hover:border-gold hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default MyOrders;
