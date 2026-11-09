import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronDown,
  Eye,
  ImageOff,
  Loader2,
  Mail,
  Phone,
  ShoppingCart,
  UserRound,
  X,
  Package,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import api from "../../services/api";

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
const dateText = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";
const titleCase = (value) =>
  String(value || "unknown").replace(/^./, (c) => c.toUpperCase());
const statusStyles = {
  pending: "bg-[#FFF0DB] text-[#9B681D]",
  confirmed: "bg-[#E8EFFB] text-[#466D9B]",
  processing: "bg-[#F0E7FF] text-[#74569B]",
  shipped: "bg-[#E1F2FA] text-[#397C9A]",
  delivered: "bg-[#E7F5E8] text-[#34754A]",
  cancelled: "bg-[#FFE5E5] text-[#A63F42]",
  returned: "bg-[#ECE9E6] text-[#6B625D]",
};

function Badge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${statusStyles[status] || "bg-[#F0E7FF] text-[#74569B]"}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {titleCase(status)}
    </span>
  );
}

function ProductImage({ src, title }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#FFF0DB]">
      {src && !failed ? (
        <img
          src={src.trim()}
          alt={title}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <ImageOff size={20} className="text-[#C9A46A]" />
      )}
    </div>
  );
}

function RoleDropdown({ value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  useEffect(() => {
    const outside = (event) => {
      if (!root.current?.contains(event.target)) setOpen(false);
    };
    const escape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, []);
  return (
    <div ref={root} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex w-full items-center justify-between rounded-xl border border-[#EAE2D8] bg-white px-4 py-3 text-sm transition hover:border-[#C9A46A] disabled:opacity-50"
      >
        {titleCase(value)}{" "}
        <ChevronDown
          size={17}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div
          role="listbox"
          aria-label="Select user role"
          className="absolute left-0 right-0 top-[calc(100%+7px)] z-20 rounded-xl border border-[#EAE2D8] bg-white p-1.5 shadow-[0_14px_35px_rgba(74,46,31,.15)]"
        >
          {["user", "admin"].map((role) => (
            <button
              type="button"
              role="option"
              aria-selected={value === role}
              key={role}
              onClick={() => {
                onChange(role);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm hover:bg-[#FFF0DB] ${value === role ? "bg-[#FFF5EB]" : ""}`}
            >
              {titleCase(role)}
              {value === role && <Check size={16} className="text-[#C77E77]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CartModal({ cart, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);
  const validCart = (cart || []).filter((entry) => entry.product);
  const quantity = validCart.reduce(
    (sum, entry) => sum + Number(entry.quantity || 0),
    0,
  );
  const total = validCart.reduce(
    (sum, entry) =>
      sum +
      Number(entry.quantity || 0) * Number(entry.product.discountPrice || 0),
    0,
  );
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
      role="presentation"
    >
      <div
        className="absolute inset-0 bg-[#27180F]/55 backdrop-blur-[5px]"
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-modal-title"
        className="relative z-10 flex w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-[#EAE2D8] bg-[#FFFCF8] shadow-[0_25px_90px_rgba(35,20,12,.3)]"
        style={{ maxHeight: "min(85vh, 760px)" }}
      >
        <div className="flex items-center justify-between gap-3 border-b border-[#EAE2D8] px-5 py-4 sm:px-6">
          <div>
            <h2
              id="cart-modal-title"
              className="flex items-center gap-2 font-serif text-xl text-[#4A2E1F]"
            >
              <ShoppingCart size={21} /> Customer Cart
            </h2>
            <p className="mt-1 text-xs text-[#8B817A]">
              {quantity} {quantity === 1 ? "item" : "items"} in cart
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="rounded-xl border border-[#EAE2D8] p-2 text-[#4A2E1F] hover:bg-[#FFF0DB]"
          >
            <X size={20} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6">
          {!validCart.length ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <ShoppingCart size={35} className="text-[#C9A46A]" />
              <p className="font-medium">This cart is empty</p>
            </div>
          ) : (
            <div className="divide-y divide-[#EAE2D8]">
              {validCart.map((entry, index) => (
                <div
                  key={`${entry.product._id}-${index}`}
                  className="flex gap-3 py-4 first:pt-0 last:pb-0"
                >
                  <ProductImage
                    src={entry.product.images?.[0]}
                    title={entry.product.title}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold">
                      {entry.product.title}
                    </p>
                    <p className="mt-1 text-xs text-[#8B817A]">
                      {entry.product.category}
                    </p>
                    <p className="mt-2 text-xs text-[#8B817A]">
                      {entry.quantity} × {money(entry.product.discountPrice)}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold">
                    {money(entry.quantity * entry.product.discountPrice)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border-t border-[#EAE2D8] bg-[#FFF9F2] px-5 py-4 sm:px-6">
          <div className="flex justify-between gap-3">
            <span className="text-sm text-[#8B817A]">Cart subtotal</span>
            <span className="font-serif text-xl font-semibold">
              {money(total)}
            </span>
          </div>
          <p className="mt-1 text-xs text-[#8B817A]">
            Based on the product prices currently stored in the cart.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-4 w-full rounded-xl bg-[#C77E77] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#B96C66]"
          >
            Close
          </button>
        </div>
      </section>
    </div>
  );
}

export default function AdminUserDetails() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get(`/auth/admin/users/${userId}`);
        if (active) {
          setUser(data.user);
          setRole(data.user.role);
        }
      } catch (err) {
        if (active)
          setError(
            err.response?.data?.message || "Unable to load user details.",
          );
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [userId]);

  async function updateRole() {
    if (!user || saving || role === user.role) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const { data } = await api.patch(`/auth/admin/users/${userId}/role`, {
        role,
      });
      setUser((previous) => ({ ...previous, role: data.user.role }));
      setRole(data.user.role);
      setNotice("User role updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update user role.");
      setRole(user.role);
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <div className="min-h-screen bg-[#FFF9F2] p-5">
        <div className="h-9 w-60 animate-pulse rounded-xl bg-[#FFF0DB]" />
        <div className="mt-6 h-48 animate-pulse rounded-2xl bg-[#FFF0DB]" />
        <div className="mt-5 h-72 animate-pulse rounded-2xl bg-[#FFF0DB]" />
      </div>
    );
  if (!user)
    return (
      <div className="min-h-screen bg-[#FFF9F2] p-6">
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-2 text-sm"
        >
          <ArrowLeft size={17} /> Back to Users
        </Link>
        <p className="mt-5 text-sm text-red-700">
          {error || "User not found."}
        </p>
      </div>
    );

  const initials =
    user.fullName
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((name) => name[0])
      .join("")
      .toUpperCase() || "U";
  const cartCount = (user.cart || []).reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-[#FFF9F2] pb-12 text-[#4A2E1F]">
      <div className="mb-6">
        <Link
          to="/admin/users"
          className="mb-4 inline-flex items-center gap-2 text-sm text-[#8B817A] hover:text-[#C77E77]"
        >
          <ArrowLeft size={17} /> Back to Users
        </Link>
        <h1 className="font-serif text-3xl sm:text-4xl">User Details</h1>
        <p className="mt-2 text-sm text-[#8B817A]">
          View customer information, orders, and manage access.
        </p>
      </div>
      {error && (
        <div
          role="alert"
          className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle size={18} />
          {error}
        </div>
      )}
      {notice && (
        <div
          role="status"
          className="mb-4 rounded-xl border border-[#CDE6D0] bg-[#E7F5E8] p-4 text-sm text-[#34754A]"
        >
          {notice}
        </div>
      )}
      <section className="grid gap-6 rounded-2xl border border-[#EAE2D8] bg-[#FFFCF8] p-5 shadow-[0_5px_20px_rgba(74,46,31,.035)] sm:p-6 xl:grid-cols-[minmax(0,1.8fr)_minmax(120px,.65fr)_minmax(140px,.75fr)_minmax(200px,1fr)] xl:gap-0">
        <div className="flex min-w-0 gap-4 sm:gap-5 xl:pr-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#F2DED5] font-serif text-2xl sm:h-20 sm:w-20">
            {initials}
          </div>
          <div className="min-w-0 space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-serif text-xl font-semibold sm:text-2xl">
                {user.fullName}
              </h2>
              <span
                className={`rounded-full px-3 py-1 text-xs ${user.role === "admin" ? "bg-[#E7F5E8] text-[#34754A]" : "bg-[#F0E7FF] text-[#74569B]"}`}
              >
                {titleCase(user.role)}
              </span>
            </div>
            <p className="flex items-center gap-2 break-all text-sm text-[#716660]">
              <Mail size={16} className="shrink-0" />
              {user.email}
            </p>
            <p className="flex items-center gap-2 text-sm text-[#716660]">
              <Phone size={16} />
              {user.phone || "—"}
            </p>
            <p className="flex items-center gap-2 text-sm text-[#716660]">
              <CalendarDays size={16} />
              Joined {dateText(user.createdAt)}
            </p>
          </div>
        </div>
        <div className="border-t border-[#EAE2D8] pt-4 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
          <Package size={23} className="mb-3 text-[#B07865]" />
          <p className="text-sm text-[#8B817A]">Total Orders</p>
          <p className="mt-1 font-serif text-3xl font-semibold">
            {user.totalOrders ?? 0}
          </p>
        </div>
        <div className="border-t border-[#EAE2D8] pt-4 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
          <span className="mb-2 block text-2xl text-[#B07865]">₹</span>
          <p className="text-sm text-[#8B817A]">Total Spent</p>
          <p className="mt-1 font-serif text-2xl font-semibold">
            {money(user.totalSpent)}
          </p>
        </div>
        <div className="border-t border-[#EAE2D8] pt-4 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
          <p className="mb-3 flex items-center gap-2 text-sm font-medium">
            <UserRound size={18} /> Role
          </p>
          <RoleDropdown value={role} onChange={setRole} disabled={saving} />
          <button
            type="button"
            disabled={saving || role === user.role}
            onClick={updateRole}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C77E77] px-3 py-3 text-sm font-medium text-white hover:bg-[#B96C66] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <ShieldCheck size={17} />
            )}
            Save Role
          </button>
        </div>
      </section>
      <section className="mt-5 rounded-2xl border border-[#EAE2D8] bg-[#FFFCF8] p-5 shadow-[0_5px_20px_rgba(74,46,31,.035)] sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 font-serif text-xl">
              <ShoppingCart size={22} /> Customer Cart
            </h2>
            {/* <p className="mt-1 text-sm text-[#8B817A]">
              {cartCount} {cartCount === 1 ? "item" : "items"} currently in cart
            </p> */}
          </div>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#C77E77] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#B96C66]"
          >
            <Eye size={17} /> View Cart
          </button>
        </div>
      </section>
      <section className="mt-5 overflow-hidden rounded-2xl border border-[#EAE2D8] bg-[#FFFCF8] shadow-[0_5px_20px_rgba(74,46,31,.035)]">
        <div className="p-5 sm:p-6">
          <h2 className="flex items-center gap-2 font-serif text-xl">
            <Package size={22} /> Recent Orders
          </h2>
          <p className="mt-1 text-sm text-[#8B817A]">
            Showing the customer's last 5 orders.
          </p>
        </div>
        {!(user.recentOrders || []).length ? (
          <div className="px-5 pb-10 text-sm text-[#8B817A]">
            This customer has no orders yet.
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead className="bg-[#FFF5EB] text-xs text-[#8B817A]">
                  <tr>
                    <th className="px-5 py-3 font-medium">Order ID</th>
                    <th className="px-5 py-3 font-medium">Amount</th>
                    <th className="px-5 py-3 font-medium">Order Status</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 font-medium">View</th>
                  </tr>
                </thead>
                <tbody>
                  {user.recentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-t border-[#EAE2D8] hover:bg-[#FFF9F2]"
                    >
                      <td className="px-5 py-4 font-semibold">
                        #{String(order._id).slice(-8).toUpperCase()}
                      </td>
                      <td className="px-5 py-4">{money(order.totalAmount)}</td>
                      <td className="px-5 py-4">
                        <Badge status={order.orderStatus} />
                      </td>
                      <td className="px-5 py-4 text-[#716660]">
                        {dateText(order.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          to={`/admin/orders/${order._id}`}
                          className="inline-flex rounded-lg border border-[#EAE2D8] px-4 py-2 text-xs text-[#B07865] hover:bg-[#FFF0DB]"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="divide-y divide-[#EAE2D8] sm:hidden">
              {user.recentOrders.map((order) => (
                <div key={order._id} className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold">
                      #{String(order._id).slice(-8).toUpperCase()}
                    </span>
                    <Badge status={order.orderStatus} />
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                    <span>{money(order.totalAmount)}</span>
                    <span className="text-xs text-[#8B817A]">
                      {dateText(order.createdAt)}
                    </span>
                  </div>
                  <Link
                    to={`/admin/orders/${order._id}`}
                    className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#B07865]"
                  >
                    <Eye size={15} /> View Order
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
        <p className="border-t border-[#EAE2D8] px-5 py-4 text-xs text-[#8B817A]">
          Showing {user.recentOrders?.length || 0} of {user.totalOrders || 0}{" "}
          orders
        </p>
      </section>
      {cartOpen && (
        <CartModal cart={user.cart} onClose={() => setCartOpen(false)} />
      )}
    </div>
  );
}
