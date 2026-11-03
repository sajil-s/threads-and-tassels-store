
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Truck,
  MapPin,
  CreditCard,
  CalendarDays,
  Copy,
} from "lucide-react";

import { getMyOrderById } from "../services/orderApi";

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

function OrderDetails() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadOrder() {
      try {
        setLoading(true);
        setError("");

        const data = await getMyOrderById(orderId);

        if (active) {
          setOrder(data.order);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              "Unable to load order details."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadOrder();

    return () => {
      active = false;
    };
  }, [orderId]);

  async function copyTrackingId() {
    if (!order?.trackingId) return;

    try {
      await navigator.clipboard.writeText(order.trackingId);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[65vh] bg-ivory py-24 text-center text-sm text-taupe">
        Loading order details...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[65vh] bg-ivory px-5 py-24 text-center">
        <p role="alert" className="text-sm text-red-600">
          {error || "Order not found."}
        </p>

        <Link
          to="/account/orders"
          className="mt-6 inline-flex text-sm font-medium text-chocolate underline"
        >
          Back to My Orders
        </Link>
      </div>
    );
  }

  const isPaid = order.paymentStatus === "paid";
  const shipping = order.shippingAddress;

  return (
    <section className="min-h-[75vh] bg-ivory px-5 py-12 sm:px-8 lg:py-16">
      <div className="mx-auto max-w-5xl">

        <Link
          to="/account/orders"
          className="mb-8 inline-flex items-center gap-2 text-sm text-taupe transition-colors hover:text-chocolate"
        >
          <ArrowLeft size={17} />
          Back to My Orders
        </Link>

        <div className="mb-9">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-taupe">
            Threads & Tassels
          </p>

          <h1 className="font-serif text-3xl text-chocolate sm:text-4xl">
            Order Details
          </h1>

          <p className="mt-3 break-all text-xs text-taupe">
            Order #{order._id.toUpperCase()}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

          <div className="space-y-6">

            {/* Order Summary */}
            <div className="rounded-2xl border border-[#EAE2D8] bg-offwhite p-5 sm:p-7">
              <div className="mb-6 flex items-center gap-3">
                <Package size={21} className="text-gold" />

                <h2 className="font-serif text-2xl text-chocolate">
                  Order Summary
                </h2>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="mb-2 flex items-center gap-2 text-xs text-taupe">
                    <CalendarDays size={15} />
                    Order Date
                  </p>

                  <p className="text-sm text-chocolate">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs text-taupe">
                    Order Status
                  </p>

                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${
                      isPaid
                        ? statusStyles[order.orderStatus] ||
                          "bg-gray-100 text-gray-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {isPaid
                      ? order.orderStatus
                      : `Payment ${order.paymentStatus}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Purchased Items */}
            <div className="rounded-2xl border border-[#EAE2D8] bg-offwhite p-5 sm:p-7">
              <h2 className="mb-6 font-serif text-2xl text-chocolate">
                Purchased Items
              </h2>

              <div className="divide-y divide-[#EAE2D8]">
                {order.items?.map((item, index) => (
                  <div
                    key={`${item.product}-${index}`}
                    className="flex gap-4 py-5 first:pt-0 last:pb-0"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-24 w-20 shrink-0 rounded-lg bg-ivory object-cover sm:h-28 sm:w-24"
                    />

                    <div className="flex min-w-0 flex-1 flex-col justify-center">
                      <h3 className="line-clamp-2 text-sm font-medium text-chocolate sm:text-base">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-xs text-taupe">
                        Quantity: {item.quantity}
                      </p>

                      <p className="mt-2 text-xs text-taupe">
                        {formatPrice(item.price)} each
                      </p>

                      <p className="mt-2 text-sm font-semibold text-chocolate">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="rounded-2xl border border-[#EAE2D8] bg-offwhite p-5 sm:p-7">
              <div className="mb-5 flex items-center gap-3">
                <MapPin size={21} className="text-gold" />

                <h2 className="font-serif text-2xl text-chocolate">
                  Shipping Address
                </h2>
              </div>

              <div className="space-y-1 text-sm leading-7 text-chocolate">
                <p className="font-medium">{shipping?.fullName}</p>
                <p>{shipping?.addressLine}</p>
                <p>
                  {shipping?.city}, {shipping?.state} - {shipping?.postalCode}
                </p>
                <p>{shipping?.country}</p>
                <p>Phone: {shipping?.phone}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">

            {/* Delivery Tracking */}
            <div className="rounded-2xl border border-[#EAE2D8] bg-offwhite p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <Truck size={21} className="text-gold" />

                <h2 className="font-serif text-xl text-chocolate">
                  Delivery Tracking
                </h2>
              </div>

              {order.deliveryPartner || order.trackingId ? (
                <div className="space-y-5">
                  {order.deliveryPartner && (
                    <div>
                      <p className="text-xs text-taupe">
                        Delivery Partner
                      </p>

                      <p className="mt-2 text-sm font-medium text-chocolate">
                        {order.deliveryPartner}
                      </p>
                    </div>
                  )}

                  {order.trackingId && (
                    <div>
                      <p className="text-xs text-taupe">
                        Tracking ID
                      </p>

                      <div className="mt-2 flex items-center justify-between gap-3">
                        <p className="min-w-0 break-all text-sm font-medium text-chocolate">
                          {order.trackingId}
                        </p>

                        <button
                          type="button"
                          onClick={copyTrackingId}
                          aria-label="Copy tracking ID"
                          className="shrink-0 text-gold hover:text-chocolate"
                        >
                          <Copy size={17} />
                        </button>
                      </div>

                      {copied && (
                        <p className="mt-2 text-xs text-green-700">
                          Tracking ID copied
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm leading-6 text-taupe">
                  Tracking information will appear here once
                  your order is dispatched.
                </p>
              )}
            </div>

            {/* Payment Summary */}
            <div className="rounded-2xl border border-[#EAE2D8] bg-offwhite p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <CreditCard size={21} className="text-gold" />

                <h2 className="font-serif text-xl text-chocolate">
                  Payment Summary
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-taupe">Payment Method</span>
                  <span className="capitalize text-chocolate">
                    {order.paymentMethod}
                  </span>
                </div>

                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-taupe">Payment Status</span>
                  <span className="capitalize text-chocolate">
                    {order.paymentStatus}
                  </span>
                </div>

                <div className="flex justify-between gap-3 border-t border-[#EAE2D8] pt-4">
                  <span className="text-sm font-medium text-chocolate">
                    Total Amount
                  </span>

                  <span className="text-lg font-semibold text-chocolate">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OrderDetails;
