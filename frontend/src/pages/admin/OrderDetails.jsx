import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, CalendarDays, Check, ChevronDown, CreditCard, ImageOff,
  Loader2, MapPin, Package, Save, Truck, UserRound, AlertCircle,
} from "lucide-react";
import api from "../../services/api";

const STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "returned"];
const STATUS_STYLES = {
  pending: "bg-[#FFF0DB] text-[#9B681D]", confirmed: "bg-[#E8EFFB] text-[#466D9B]",
  processing: "bg-[#F0E7FF] text-[#74569B]", shipped: "bg-[#E1F2FA] text-[#397C9A]",
  delivered: "bg-[#E7F5E8] text-[#34754A]", cancelled: "bg-[#FFE5E5] text-[#A63F42]",
  returned: "bg-[#ECE9E6] text-[#6B625D]",
};
const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
const titleCase = (s) => String(s || "Unknown").replace(/^./, (c) => c.toUpperCase());
const formatDate = (date, opts = {}) => date ? new Date(date).toLocaleString("en-IN", {
  timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric", ...opts,
}) : "Not available";

function Card({ title, icon: Icon, children, className = "" }) {
  return <section className={`rounded-2xl border border-[#EAE2D8] bg-[#FFFCF8] p-5 shadow-[0_5px_20px_rgba(74,46,31,0.035)] sm:p-6 ${className}`}>
    <h2 className="mb-5 flex items-center gap-3 font-serif text-xl text-[#4A2E1F]"><Icon size={21} strokeWidth={1.7} />{title}</h2>
    {children}
  </section>;
}
function Detail({ label, value }) {
  return <div className="grid grid-cols-[105px_minmax(0,1fr)] gap-3 text-sm sm:grid-cols-[115px_minmax(0,1fr)]">
    <span className="text-[#8B817A]">{label}</span><span className="min-w-0 break-words text-[#4A2E1F]">{value || "—"}</span>
  </div>;
}
function StatusBadge({ status }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${STATUS_STYLES[status] || "bg-gray-100 text-gray-700"}`}>
    <span className="h-1.5 w-1.5 rounded-full bg-current" />{titleCase(status)}
  </span>;
}
function StatusDropdown({ value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  useEffect(() => {
    function outside(event) { if (!root.current?.contains(event.target)) setOpen(false); }
    function escape(event) { if (event.key === "Escape") setOpen(false); }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, []);
  return <div ref={root} className="relative">
    <button type="button" disabled={disabled} aria-expanded={open} aria-haspopup="listbox" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-3 rounded-xl border border-[#EAE2D8] bg-white px-4 py-3 text-left text-sm text-[#4A2E1F] transition hover:border-[#C9A46A] disabled:opacity-60">
      <StatusBadge status={value} /><ChevronDown size={17} className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
    </button>
    {open && <div role="listbox" aria-label="Order status" className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 max-h-72 overflow-y-auto rounded-2xl border border-[#EAE2D8] bg-white p-2 shadow-[0_16px_40px_rgba(74,46,31,0.16)]">
      {STATUSES.map((status) => <button key={status} type="button" role="option" aria-selected={value === status} onClick={() => { onChange(status); setOpen(false); }} className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition hover:bg-[#FFF5EB] ${value === status ? "bg-[#FFF0DB]" : ""}`}>
        <StatusBadge status={status} />{value === status && <Check size={16} className="text-[#C77E77]" />}
      </button>)}
    </div>}
  </div>;
}
function ProductImage({ src, title }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#FFF0DB]">
    {src && !failed ? <img src={src.trim()} alt={title} onError={() => setFailed(true)} className="h-full w-full object-cover" /> : <ImageOff size={20} className="text-[#C9A46A]" />}
  </div>;
}

export default function OrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("pending");
  const [deliveryPartner, setDeliveryPartner] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function fillForm(data) {
    setOrder(data);
    setStatus(data.orderStatus || "pending");
    setDeliveryPartner(data.deliveryPartner || "");
    setTrackingId(data.trackingId || "");
    setAdminNote(data.adminNote || "");
  }
  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true); setError("");
      try {
        const { data } = await api.get(`/orders/admin/${orderId}`);
        if (active) fillForm(data.order);
      } catch (err) {
        if (active) setError(err.response?.data?.message || "Unable to load this order.");
      } finally { if (active) setLoading(false); }
    }
    load();
    return () => { active = false; };
  }, [orderId]);

  async function save(changes, successText) {
    if (saving) return;
    setSaving(true); setError(""); setNotice("");
    try {
      const { data } = await api.put(`/orders/admin/${orderId}`, changes);
      fillForm(data.order);
      setNotice(successText);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save changes. Please try again.");
    } finally { setSaving(false); }
  }

  if (loading) return <div className="min-h-screen bg-[#FFF9F2] p-5"><div className="h-10 w-64 animate-pulse rounded-xl bg-[#FFF0DB]" /><div className="mt-6 grid gap-5 lg:grid-cols-2">{[1, 2, 3, 4].map((n) => <div key={n} className="h-52 animate-pulse rounded-2xl bg-[#FFF0DB]" />)}</div></div>;
  if (!order) return <div className="min-h-screen bg-[#FFF9F2] p-6 text-[#4A2E1F]"><Link to="/admin/orders" className="mb-6 inline-flex items-center gap-2 text-sm"><ArrowLeft size={17} /> Back to Orders</Link><p role="alert" className="mt-4 text-red-700">{error || "Order not found."}</p></div>;

  const itemCount = order.items?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || 0;
  const itemTotal = order.items?.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.price || 0), 0) || 0;
  const address = order.shippingAddress || {};
  const transactionId = order.razorpayPaymentId || order.razorpayOrderId || "Not available";
  return <div className="min-h-screen bg-[#FFF9F2] pb-12 text-[#4A2E1F]">
    <div className="mb-6"><Link to="/admin/orders" className="mb-4 inline-flex items-center gap-2 text-sm text-[#8B817A] transition hover:text-[#C77E77]"><ArrowLeft size={17} /> Back to Orders</Link><p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-[#6DAA79]">Threads & Tassels</p><h1 className="font-serif text-3xl sm:text-4xl">Order Details</h1><p className="mt-2 text-sm text-[#8B817A]">View and manage order information, shipping and payment.</p></div>
    {error && <div role="alert" className="mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle size={18} />{error}</div>}
    {notice && <div role="status" className="mb-5 rounded-xl border border-[#CDE6D0] bg-[#E7F5E8] p-4 text-sm text-[#34754A]">{notice}</div>}
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="min-w-0 space-y-5">
        <section className="grid gap-4 rounded-2xl border border-[#EAE2D8] bg-[#FFFCF8] p-5 shadow-sm sm:grid-cols-3 sm:p-6">
          <div><p className="mb-2 text-xs text-[#8B817A]">Order ID</p><p className="break-all font-serif text-xl font-semibold">#{String(order._id).slice(-8).toUpperCase()}</p></div>
          <div className="sm:border-l sm:border-[#EAE2D8] sm:pl-5"><p className="mb-2 text-xs text-[#8B817A]">Order Date</p><p className="flex items-center gap-2 text-sm font-semibold"><CalendarDays size={17} />{formatDate(order.createdAt)}</p><p className="mt-1 text-xs text-[#8B817A]">{formatDate(order.createdAt, { hour: "2-digit", minute: "2-digit", hour12: true }).split(", ").slice(-1)[0]}</p></div>
          <div className="sm:border-l sm:border-[#EAE2D8] sm:pl-5"><p className="mb-2 text-xs text-[#8B817A]">Order Status</p><StatusBadge status={order.orderStatus} /></div>
        </section>
        <div className="grid gap-5 md:grid-cols-2">
          <Card title="Customer Details" icon={UserRound}><div className="space-y-4"><Detail label="Name" value={order.user?.fullName || address.fullName} /><Detail label="Email" value={order.user?.email} /><Detail label="Phone" value={order.user?.phone || address.phone} /></div></Card>
          <Card title="Shipping Address" icon={MapPin}><div className="space-y-4"><Detail label="Recipient" value={address.fullName} /><Detail label="Address" value={[address.addressLine, address.city, address.state, address.postalCode, address.country].filter(Boolean).join(", ")} /><Detail label="Phone" value={address.phone} /></div></Card>
        </div>
        <Card title="Order Items" icon={Package}>
          <div className="hidden overflow-x-auto sm:block"><table className="w-full min-w-[510px] text-left text-sm"><thead className="bg-[#FFF5EB] text-xs text-[#8B817A]"><tr><th className="rounded-l-lg px-3 py-3 font-medium">Image</th><th className="px-3 py-3 font-medium">Product Name</th><th className="px-3 py-3 font-medium">Quantity</th><th className="px-3 py-3 font-medium">Price</th><th className="rounded-r-lg px-3 py-3 font-medium">Total</th></tr></thead><tbody>{(order.items || []).map((item, i) => <tr key={`${item.product?._id || item.product}-${i}`} className="border-b border-[#EAE2D8] last:border-0"><td className="py-3 pl-3"><ProductImage src={item.image} title={item.title} /></td><td className="px-3 py-3 font-medium">{item.title}</td><td className="px-3 py-3">{item.quantity}</td><td className="whitespace-nowrap px-3 py-3">{money(item.price)}</td><td className="whitespace-nowrap px-3 py-3 font-semibold">{money(item.price * item.quantity)}</td></tr>)}</tbody></table></div>
          <div className="divide-y divide-[#EAE2D8] sm:hidden">{(order.items || []).map((item, i) => <div key={`${item.product?._id || item.product}-${i}`} className="flex gap-3 py-3 first:pt-0 last:pb-0"><ProductImage src={item.image} title={item.title} /><div className="min-w-0 flex-1"><p className="text-sm font-medium">{item.title}</p><p className="mt-1 text-xs text-[#8B817A]">{item.quantity} × {money(item.price)}</p><p className="mt-1 text-sm font-semibold">{money(item.quantity * item.price)}</p></div></div>)}</div>
        </Card>
        <div className="grid gap-5 md:grid-cols-2">
          <Card title="Payment Summary" icon={CreditCard}>
            <div className="space-y-4 text-sm"><div className="flex justify-between gap-3"><span className="text-[#8B817A]">Items ({itemCount})</span><span>{money(itemTotal)}</span></div><div className="border-t border-[#EAE2D8] pt-4"><div className="flex justify-between gap-3 font-semibold"><span>Total Amount</span><span className="font-serif text-xl">{money(order.totalAmount)}</span></div></div><p className="text-xs leading-5 text-[#8B817A]">The total is the final amount recorded for this order. A separate shipping and discount breakdown is not stored.</p></div>
          </Card>
          <Card title="Payment Information" icon={CreditCard}>
            <div className="space-y-4"><Detail label="Method" value={order.paymentMethod === "razorpay" ? "Razorpay" : titleCase(order.paymentMethod)} /><Detail label="Transaction ID" value={<span className="break-all">{transactionId}</span>} /><Detail label="Payment Date" value="Not recorded" /><div className="flex items-center justify-between gap-3"><span className="text-sm text-[#8B817A]">Payment Status</span><span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${order.paymentStatus === "paid" ? "bg-[#E7F5E8] text-[#34754A]" : order.paymentStatus === "failed" ? "bg-[#FFE5E5] text-[#A63F42]" : "bg-[#FFF0DB] text-[#9B681D]"}`}>{titleCase(order.paymentStatus)}</span></div></div>
          </Card>
        </div>
      </div>
      <aside className="space-y-5">
        <Card title="Update Order Status" icon={Package}>
          <StatusDropdown value={status} onChange={setStatus} disabled={saving} />
          <button type="button" disabled={saving || status === order.orderStatus} onClick={() => save({ orderStatus: status }, "Order status updated.")} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C77E77] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#B96C66] disabled:cursor-not-allowed disabled:opacity-50">{saving ? <Loader2 size={17} className="animate-spin" /> : <Check size={17} />}Update Status</button>
          {(status === "cancelled" || status === "returned") && <p className="mt-3 text-xs leading-5 text-[#8B817A]">Stock quantities will need to be adjusted separately.</p>}
        </Card>
        <Card title="Delivery Details" icon={Truck}>
          <label className="mb-3 block text-xs font-medium text-[#8B817A]">Delivery Partner<input value={deliveryPartner} onChange={(e) => setDeliveryPartner(e.target.value)} maxLength={100} placeholder="e.g. India Post, DTDC" className="mt-2 w-full rounded-xl border border-[#EAE2D8] bg-white px-4 py-3 text-sm text-[#4A2E1F] outline-none focus:border-[#C9A46A]" /></label>
          <label className="mb-3 block text-xs font-medium text-[#8B817A]">Tracking ID<input value={trackingId} onChange={(e) => setTrackingId(e.target.value)} maxLength={100} placeholder="Enter tracking ID" className="mt-2 w-full rounded-xl border border-[#EAE2D8] bg-white px-4 py-3 text-sm text-[#4A2E1F] outline-none focus:border-[#C9A46A]" /></label>
          {/* <label className="block text-xs font-medium text-[#8B817A]">Private Note<textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)} maxLength={1000} rows={3} placeholder="Optional note for your team" className="mt-2 w-full resize-y rounded-xl border border-[#EAE2D8] bg-white px-4 py-3 text-sm text-[#4A2E1F] outline-none focus:border-[#C9A46A]" /></label> */}
          <button type="button" disabled={saving} onClick={() => save({ deliveryPartner, trackingId, adminNote }, "Delivery details saved.")} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C77E77] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#B96C66] disabled:cursor-not-allowed disabled:opacity-60">{saving ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}Save Details</button>
        </Card>
      </aside>
    </div>
  </div>;
}
