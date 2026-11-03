import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, Search, ShoppingBag, AlertCircle } from "lucide-react";
import api from "../../services/api";

const LIMIT = 10;
const PERIODS = [
  { value: "today", label: "Today" },
  { value: "week", label: "Last 7 Days" },
  { value: "month", label: "This Month" },
  { value: "all", label: "All Time" },
  { value: "custom", label: "Custom Range" },
];
const statusColors = {
  pending: "bg-[#FFF0DB] text-[#A36A19]", confirmed: "bg-[#E7F5E8] text-[#34754A]",
  processing: "bg-[#FFF0DB] text-[#A36A19]", shipped: "bg-[#E2F3FA] text-[#34758A]",
  delivered: "bg-[#E7F5E8] text-[#34754A]", cancelled: "bg-[#FFE5E5] text-[#A63F42]",
  returned: "bg-[#F0E7FF] text-[#74569B]",
};
const formatMoney = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;
const formatDate = (value) => new Date(value).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true });
function indiaToday() {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const obj = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${obj.year}-${obj.month}-${obj.day}`;
}
function rangeFor(period, from, to) {
  const today = indiaToday();
  if (period === "all") return {};
  if (period === "custom") return { startDate: from, endDate: to };
  if (period === "today") return { startDate: today, endDate: today };
  const [year, month, day] = today.split("-").map(Number);
  if (period === "month") return { startDate: `${year}-${String(month).padStart(2, "0")}-01`, endDate: today };
  return { startDate: new Date(Date.UTC(year, month - 1, day - 6)).toISOString().slice(0, 10), endDate: today };
}

export default function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalOrders: 0, totalPages: 0 });
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("month");
  const [from, setFrom] = useState(() => `${indiaToday().slice(0, 7)}-01`);
  const [to, setTo] = useState(indiaToday);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const dropdownRef = useRef(null);
  const invalidRange = period === "custom" && (!from || !to || from > to || to > indiaToday());
  const { startDate, endDate } = rangeFor(period, from, to);

  useEffect(() => {
    const timer = setTimeout(() => { setPage(1); setSearch(searchInput.trim()); }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);
  useEffect(() => {
    const onPointer = (event) => { if (!dropdownRef.current?.contains(event.target)) setOpen(false); };
    const onKey = (event) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onPointer); document.removeEventListener("keydown", onKey); };
  }, []);
  useEffect(() => {
    if (invalidRange) { setLoading(false); return; }
    let active = true;
    async function load() {
      setLoading(true); setError("");
      try {
        const { data } = await api.get("/orders/admin", { params: { page, limit: LIMIT, ...(search ? { search } : {}), ...(startDate ? { startDate } : {}), ...(endDate ? { endDate } : {}) } });
        if (!active) return;
        setOrders(data.orders || []);
        setPagination(data.pagination || { totalOrders: 0, totalPages: 0 });
      } catch (err) {
        if (active) { setError(err.response?.data?.message || "Unable to load orders."); setOrders([]); }
      } finally { if (active) setLoading(false); }
    }
    load();
    return () => { active = false; };
  }, [page, search, startDate, endDate, invalidRange]);

  const total = pagination.totalOrders || 0;
  const pages = pagination.totalPages || 0;
  const first = total ? (page - 1) * LIMIT + 1 : 0;
  const last = Math.min(page * LIMIT, total);
  return (
    <div className="min-h-screen bg-[#FFF9F2] pb-10 text-[#4A2E1F]">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-[#6DAA79]">Threads & Tassels</p>
          <h1 className="font-serif text-3xl sm:text-4xl">Orders</h1>
          <p className="mt-2 text-sm text-[#8B817A]">Track and manage all customer orders.</p>
        </div>
        <div className="relative z-20" ref={dropdownRef}>
          <button type="button" aria-expanded={open} aria-haspopup="listbox" onClick={() => setOpen((value) => !value)} className="flex min-h-11 items-center gap-2 rounded-xl border border-[#EAE2D8] bg-white px-3 py-2.5 text-sm font-medium shadow-sm transition hover:border-[#C9A46A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A46A]">
            <CalendarDays size={17} className="text-[#C77E77]" />
            {PERIODS.find((item) => item.value === period)?.label}
            <ChevronDown size={16} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
          </button>
          {open && (
            <div role="listbox" aria-label="Order date range" className="absolute right-0 top-full z-30 mt-2 w-56 overflow-hidden rounded-2xl border border-[#EAE2D8] bg-[#FFFCF8] p-2 shadow-[0_16px_40px_rgba(74,46,31,0.14)]">
              <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A7A7A5]">Filter by date</p>
              {PERIODS.map((item) => (
                <button key={item.value} type="button" role="option" aria-selected={period === item.value} onClick={() => { setPeriod(item.value); setPage(1); setOpen(false); }} className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${period === item.value ? "bg-[#FFF0DB] font-semibold text-[#9C5B4B]" : "hover:bg-[#FFF9F2]"}`}>
                  {item.label}{period === item.value && <Check size={16} className="text-[#C77E77]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {period === "custom" && (
        <div className="mb-5 flex flex-wrap gap-3 rounded-xl border border-[#EAE2D8] bg-white p-4">
          <label className="flex-1 text-xs font-medium">From<input type="date" value={from} max={indiaToday()} onChange={(e) => { setFrom(e.target.value); setPage(1); }} className="mt-1 block w-full rounded-lg border border-[#EAE2D8] bg-[#FFF9F2] p-2 text-sm outline-none focus:border-[#C9A46A]" /></label>
          <label className="flex-1 text-xs font-medium">To<input type="date" value={to} min={from || undefined} max={indiaToday()} onChange={(e) => { setTo(e.target.value); setPage(1); }} className="mt-1 block w-full rounded-lg border border-[#EAE2D8] bg-[#FFF9F2] p-2 text-sm outline-none focus:border-[#C9A46A]" /></label>
          {invalidRange && <p className="w-full text-xs text-red-600">Select a valid date range.</p>}
        </div>
      )}
      <div className="mb-4 relative max-w-xl">
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#A7A7A5]" />
        <input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search order ID or customer..." aria-label="Search orders" className="w-full rounded-xl border border-[#EAE2D8] bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#C9A46A]" />
      </div>
      <section className="overflow-hidden rounded-2xl border border-[#EAE2D8] bg-[#FFFCF8] shadow-[0_5px_20px_rgba(74,46,31,0.035)]">
        {error && <div role="alert" className="m-4 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700"><AlertCircle size={17} />{error}</div>}
        {loading ? <div className="space-y-3 p-5">{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-16 animate-pulse rounded-xl bg-[#FFF0DB]/50" />)}</div> : orders.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-5 py-16 text-center"><ShoppingBag size={34} className="text-[#C9A46A]" /><p className="font-medium">No orders found</p><p className="text-sm text-[#8B817A]">Try another search or date range.</p></div>
        ) : <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[740px] text-left text-sm">
              <thead className="bg-[#FFF5EB] text-xs text-[#8B817A]"><tr><th className="px-5 py-4 font-medium">Order ID</th><th className="px-5 py-4 font-medium">Customer Name</th><th className="px-5 py-4 font-medium">Date</th><th className="px-5 py-4 font-medium">Total Items</th><th className="px-5 py-4 font-medium">Total Amount Paid</th><th className="px-5 py-4 font-medium">Status</th></tr></thead>
              <tbody>{orders.map((order) => (
                <tr key={order._id} tabIndex={0} role="link" aria-label={`View order ${String(order._id).slice(-8)}`} onClick={() => navigate(`/admin/orders/${order._id}`)} onKeyDown={(event) => { if (event.key === "Enter") navigate(`/admin/orders/${order._id}`); }} className="cursor-pointer border-t border-[#EAE2D8] transition hover:bg-[#FFF9F2] focus:bg-[#FFF0DB] focus:outline-none">
                  <td className="whitespace-nowrap px-5 py-4 font-semibold">#{String(order._id).slice(-8).toUpperCase()}</td>
                  <td className="px-5 py-4">{order.user?.fullName || order.shippingAddress?.fullName || "Unknown Customer"}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-xs text-[#8B817A]">{formatDate(order.createdAt)}</td>
                  <td className="px-5 py-4 tabular-nums">{(order.items || []).reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)}</td>
                  <td className="whitespace-nowrap px-5 py-4 font-semibold">{formatMoney(order.totalAmount)}</td>
                  <td className="px-5 py-4"><span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium capitalize ${statusColors[order.orderStatus] || "bg-gray-100 text-gray-700"}`}>{order.orderStatus || "Unknown"}</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <div className="divide-y divide-[#EAE2D8] md:hidden">{orders.map((order) => (
            <button type="button" key={order._id} onClick={() => navigate(`/admin/orders/${order._id}`)} className="flex w-full flex-col gap-2 p-4 text-left transition hover:bg-[#FFF9F2]">
              <div className="flex items-center justify-between gap-3"><span className="text-sm font-semibold">#{String(order._id).slice(-8).toUpperCase()}</span><span className={`rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${statusColors[order.orderStatus] || "bg-gray-100 text-gray-700"}`}>{order.orderStatus || "Unknown"}</span></div>
              <div className="flex items-center justify-between gap-3"><span className="truncate text-sm">{order.user?.fullName || "Unknown Customer"}</span><span className="text-sm font-semibold">{formatMoney(order.totalAmount)}</span></div>
              <div className="flex justify-between text-xs text-[#8B817A]"><span>{formatDate(order.createdAt)}</span><span>{(order.items || []).reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)} items</span></div>
            </button>
          ))}</div>
        </>}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EAE2D8] px-4 py-4 text-xs text-[#8B817A] sm:px-5">
          <span>Showing {first}–{last} of {total} orders</span>
          <div className="flex items-center gap-2"><button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page <= 1 || loading} aria-label="Previous page" className="rounded-lg border border-[#EAE2D8] bg-white p-2 disabled:opacity-40"><ChevronLeft size={16} /></button><span className="min-w-16 text-center font-medium text-[#4A2E1F]">{page} / {Math.max(pages, 1)}</span><button type="button" onClick={() => setPage((value) => Math.min(pages, value + 1))} disabled={page >= pages || loading} aria-label="Next page" className="rounded-lg border border-[#EAE2D8] bg-white p-2 disabled:opacity-40"><ChevronRight size={16} /></button></div>
        </div>
      </section>
    </div>
  );
}
