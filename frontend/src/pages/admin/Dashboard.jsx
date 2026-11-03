import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  IndianRupee,
  ShoppingBag,
  Users,
  Package,
  CalendarDays,
  ChevronDown,
  Check,
  ChevronRight,
  AlertCircle,
  ImageOff,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  getDashboardAnalytics,
  getDashboardRecentOrders,
} from "../../services/adminApi";

const COLORS = ["#6DAA79", "#E98282", "#E9A54B", "#A486D5", "#E9BD68"];
const EMPTY_ANALYTICS = {
  totalRevenue: 0,
  totalOrders: 0,
  totalCustomers: 0,
  totalProducts: 0,
};
const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-blue-50 text-blue-700",
  processing: "bg-purple-50 text-purple-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
  returned: "bg-gray-100 text-gray-700",
};
const PAYMENT_STYLES = {
  paid: "bg-green-50 text-green-700",
  pending: "bg-amber-50 text-amber-700",
  failed: "bg-red-50 text-red-700",
  refunded: "bg-gray-100 text-gray-700",
};
const TIMEZONE = "Asia/Kolkata";

function indiaDateParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
  };
}

function isoDate(year, month, day) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function todayInIndia() {
  const { year, month, day } = indiaDateParts();
  return isoDate(year, month, day);
}

function monthStartInIndia() {
  const { year, month } = indiaDateParts();
  return isoDate(year, month, 1);
}

function lastSevenDaysStart() {
  const { year, month, day } = indiaDateParts();
  return new Date(Date.UTC(year, month - 1, day - 6)).toISOString().slice(0, 10);
}

function periodDates(period, customStart, customEnd) {
  const today = todayInIndia();
  switch (period) {
    case "today":
      return { startDate: today, endDate: today };
    case "week":
      return { startDate: lastSevenDaysStart(), endDate: today };
    case "month":
      return { startDate: monthStartInIndia(), endDate: today };
    case "custom":
      return { startDate: customStart, endDate: customEnd };
    default:
      return { startDate: "", endDate: "" };
       }
}

function formatPrice(value) {
  return `₹${Math.round(Number(value) || 0).toLocaleString("en-IN")}`;
}

function formatNumber(value) {
  return Math.round(Number(value) || 0).toLocaleString("en-IN");
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    timeZone: TIMEZONE,
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function capitalize(value) {
  const str = String(value || "Unknown");
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function AnimatedNumber({ value, currency = false }) {
  const [displayValue, setDisplayValue] = useState(0);
  const displayedRef = useRef(0);

  useEffect(() => {
    const target = Number(value) || 0;
    const initial = displayedRef.current;
    let startTime;
    let frame;
    const duration = 1000;

    function step(time) {
      if (startTime === undefined) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = initial + (target - initial) * eased;
      displayedRef.current = next;
      setDisplayValue(next);
      if (progress < 1) frame = requestAnimationFrame(step);
    }

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <span className="tabular-nums">{currency ? formatPrice(displayValue) : formatNumber(displayValue)}</span>;
}

function StatCard({ title, value, icon: Icon, background, accent, currency, loading }) {
  return (
    <div
      className="rounded-2xl border border-white/80 p-4 shadow-[0_5px_20px_rgba(74,46,31,0.055)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-5"
      style={{ backgroundColor: background }}
    >
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl text-white sm:h-12 sm:w-12" style={{ backgroundColor: accent }}>
        <Icon size={23} strokeWidth={1.8} />
      </div>
      <p className="mb-2 text-xs font-medium text-[#68564C] sm:text-sm">{title}</p>
      {loading ? (
        <div className="h-9 w-24 animate-pulse rounded-lg bg-white/65" />
      ) : (
        <h3 className="break-words font-serif text-[23px] font-semibold tracking-tight text-[#4A2E1F] sm:text-[30px]">
          <AnimatedNumber value={value} currency={currency} />
        </h3>
      )}
    </div>
  );
}

function prepareCategoryData(stats) {
  const sorted = [...stats]
    .filter((item) => Number(item.unitsSold) > 0)
    .sort((a, b) => Number(b.unitsSold) - Number(a.unitsSold));

  const top = sorted.slice(0, 4).map((item) => ({
    name: item.category || "Uncategorized",
    value: Number(item.unitsSold),
  }));
  const others = sorted.slice(4).reduce((sum, item) => sum + Number(item.unitsSold || 0), 0);
  if (others > 0) top.push({ name: "Others", value: others });
  return top;
}

function CategoryChart({ categoryStats, loading }) {
  const data = prepareCategoryData(categoryStats);
  const totalUnits = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <section className="h-full rounded-2xl border border-[#F0E5DA] bg-white p-5 shadow-[0_5px_20px_rgba(74,46,31,0.04)] sm:p-6">
      <h2 className="font-serif text-xl text-[#4A2E1F] sm:text-2xl">Top Selling Categories</h2>
      <p className="mt-1 text-xs text-[#8B817A]">Based on units sold in the selected period</p>

      {loading ? (
        <div className="flex h-[300px] items-center justify-center">
          <div className="h-44 w-44 animate-pulse rounded-full border-[35px] border-[#F0E7FF]" />
        </div>
      ) : data.length === 0 ? (
        <div className="flex h-[300px] flex-col items-center justify-center text-center">
          <ShoppingBag size={35} strokeWidth={1.3} className="mb-3 text-[#E98282]" />
          <p className="text-sm font-medium text-[#4A2E1F]">No category sales yet</p>
          <p className="mt-1 text-xs text-[#8B817A]">Paid sales will appear here.</p>
        </div>
      ) : (
        <>
          <div className="relative mx-auto h-[235px] w-full max-w-[320px] sm:h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="66%"
                  outerRadius="87%"
                  paddingAngle={3}
                  stroke="none"
                  isAnimationActive
                >
                  {data.map((item, index) => (
                    <Cell key={`${item.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${formatNumber(value)} units`, "Sold"]}
                  contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #EAE2D8", borderRadius: 12, color: "#4A2E1F" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="font-serif text-3xl font-semibold text-[#4A2E1F]">{formatNumber(totalUnits)}</p>
              <p className="mt-1 text-[11px] text-[#8B817A]">Units Sold</p>
            </div>
          </div>
          <div className="mt-2 space-y-3">
            {data.map((item, index) => (
              <div key={`${item.name}-${index}`} className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="truncate text-sm text-[#4A2E1F]">{capitalize(item.name)}</span>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-xs text-[#8B817A]">{formatNumber(item.value)} units</span>
                  <span className="w-12 text-right text-sm font-semibold text-[#4A2E1F]">
                    {totalUnits ? ((item.value / totalUnits) * 100).toFixed(1) : "0.0"}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
       </section>
  );
}


function DashboardBanner() {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="relative aspect-[2/1] w-full overflow-hidden rounded-2xl border border-[#EAE2D8] bg-[#FFF0DB] lg:aspect-auto lg:h-full lg:min-h-[390px]">
      {!imageFailed ? (
        <picture>
          <source
            media="(min-width: 1024px)"
            srcSet="/images/admin-dashboard-desktop.jpg"
          />

          <img
            src="/images/admin-dashboard-mobile.jpg"
            alt="Threads and Tassels boutique"
            className="absolute inset-0 h-full w-full object-cover"
            onError={() => setImageFailed(true)}
          />
        </picture>
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-2 p-5 text-center">
          <ImageOff
            size={28}
            className="text-[#C9A46A]"
          />
          <p className="text-sm text-[#4A2E1F]">
            Dashboard banner unavailable
          </p>
        </div>
      )}
    </div>
  );
}


function RecentOrders({ orders, loading, error }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#F0E5DA] bg-white shadow-[0_5px_20px_rgba(74,46,31,0.04)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F0E5DA] px-5 py-5 sm:px-6">
        <div>
          <h2 className="font-serif text-xl text-[#4A2E1F] sm:text-2xl">Recent Orders</h2>
          <p className="mt-1 text-xs text-[#8B817A]">Latest 20 orders across all dates</p>
        </div>
        <Link to="/admin/orders" className="inline-flex items-center gap-1 text-sm font-medium text-[#4A2E1F] transition-colors hover:text-[#E98282]">
          View All <ChevronRight size={16} />
        </Link>
      </div>

      {error ? (
        <div className="px-6 py-10 text-center text-sm text-red-600">{error}</div>
      ) : loading ? (
        <div className="space-y-4 p-6">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="h-12 animate-pulse rounded-lg bg-[#FFF0DB]/60" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
          <ShoppingBag size={35} strokeWidth={1.4} className="mb-3 text-[#E98282]" />
          <p className="text-sm font-medium text-[#4A2E1F]">No orders yet</p>
          <p className="mt-1 text-xs text-[#8B817A]">Customer orders will appear here.</p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-[#FFF6EC]">
              <tr className="text-xs text-[#786B61]">
                <th className="px-5 py-4 font-medium">Order ID</th>
                <th className="px-5 py-4 font-medium">Customer</th>
                <th className="px-5 py-4 font-medium">Date</th>
                <th className="px-5 py-4 font-medium">Amount</th>
                <th className="px-5 py-4 font-medium">Payment</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium">Action</th>
              </tr>
            </thead>
             <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t border-[#F0E5DA] text-sm text-[#4A2E1F] transition-colors hover:bg-[#FFF9F2]">
                  <td className="px-5 py-4 font-medium">#{String(order._id).slice(-8).toUpperCase()}</td>
                  <td className="max-w-[170px] truncate px-5 py-4">{order.user?.fullName || "Unknown Customer"}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-[#8B817A]">{formatDate(order.createdAt)}</td>
                  <td className="whitespace-nowrap px-5 py-4 font-medium">{formatPrice(order.totalAmount)}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${PAYMENT_STYLES[order.paymentStatus] || "bg-gray-100 text-gray-700"}`}>
                      {capitalize(order.paymentStatus)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[order.orderStatus] || "bg-gray-100 text-gray-700"}`}>
                      {capitalize(order.orderStatus)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <Link to={`/admin/orders/${order._id}`} className="inline-flex items-center gap-1 font-medium text-[#D17B67] hover:text-[#4A2E1F]">
                      View <ChevronRight size={15} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

const PERIOD_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "week", label: "Last 7 Days" },
  { value: "month", label: "This Month" },
  { value: "all", label: "All Time" },
  { value: "custom", label: "Custom Range" },
];

function PeriodDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event) {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    }
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const selectedLabel = PERIOD_OPTIONS.find((option) => option.value === value)?.label || "This Month";

  return (
    <div ref={containerRef} className="relative z-30 shrink-0">
      <button
        ref={triggerRef}
        type="button"
        aria-label="Dashboard reporting period"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((previous) => !previous)}
        className={`inline-flex min-w-[172px] items-center justify-between gap-3 rounded-xl border bg-white px-3.5 py-2.5 text-sm font-medium text-[#4A2E1F] shadow-sm transition-all duration-200 hover:border-[#E98282] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E98282]/40 ${open ? "border-[#E98282] shadow-md" : "border-[#EAE2D8]"}`}
      >
        <span className="flex items-center gap-2.5">
          <CalendarDays size={17} className="text-[#D17B67]" />
          {selectedLabel}
        </span>
        <ChevronDown size={16} className={`text-[#8B817A] transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div
          role="listbox"
          aria-label="Dashboard reporting period"
          className="absolute right-0 top-full z-50 mt-2 w-[220px] overflow-hidden rounded-2xl border border-[#EAE2D8] bg-white p-1.5 shadow-[0_16px_40px_rgba(74,46,31,0.14)]"
        >
          <p className="px-3 pb-2 pt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#A7A7A5]">Reporting period</p>
          {PERIOD_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={value === option.value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
                triggerRef.current?.focus();
              }}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E98282]/40 ${value === option.value ? "bg-[#FFF0E9] font-semibold text-[#9C5B4B]" : "text-[#4A2E1F] hover:bg-[#FFF9F2]"}`}
            >
              <span>{option.label}</span>
              {value === option.value && <Check size={16} className="text-[#C77E77]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [period, setPeriod] = useState("month");
  const [customStart, setCustomStart] = useState(monthStartInIndia);
  const [customEnd, setCustomEnd] = useState(todayInIndia);
  const [analytics, setAnalytics] = useState(EMPTY_ANALYTICS);
  const [categoryStats, setCategoryStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [analyticsError, setAnalyticsError] = useState("");
  const [ordersError, setOrdersError] = useState("");

  const { startDate, endDate } = periodDates(period, customStart, customEnd);
  const invalidCustomRange =
    period === "custom" &&
    (!customStart || !customEnd || customStart > customEnd || customEnd > todayInIndia());

  useEffect(() => {
    if (invalidCustomRange) {
      setLoadingAnalytics(false);
      return;
    }

    let active = true;
    async function loadAnalytics() {
      setLoadingAnalytics(true);
      setAnalyticsError("");
      try {
        const response = await getDashboardAnalytics(startDate, endDate);
        if (!active) return;
        setAnalytics({ ...EMPTY_ANALYTICS, ...(response.analytics || {}) });
        setCategoryStats(response.categoryStats || []);
      } catch (error) {
        if (active) {
          setAnalyticsError(error.response?.data?.message || "Unable to load dashboard analytics.");
        }
      } finally {
        if (active) setLoadingAnalytics(false);
      }
    }
    loadAnalytics();
    return () => { active = false; };
  }, [startDate, endDate, invalidCustomRange]);
  useEffect(() => {
    let active = true;
    async function loadOrders() {
      setLoadingOrders(true);
      setOrdersError("");
      try {
        const response = await getDashboardRecentOrders();
        if (active) setRecentOrders((response.recentOrders || []).slice(0, 20));
      } catch (error) {
        if (active) setOrdersError(error.response?.data?.message || "Unable to load recent orders.");
      } finally {
        if (active) setLoadingOrders(false);
      }
    }
    loadOrders();
    return () => { active = false; };
  }, []);

  const stats = [
    { title: "Total Revenue", value: analytics.totalRevenue, icon: IndianRupee, background: "#FFF0DB", accent: "#E9A54B", currency: true },
    { title: "Total Orders", value: analytics.totalOrders, icon: ShoppingBag, background: "#FFE5E5", accent: "#E98282" },
    { title: "Total Customers", value: analytics.totalCustomers, icon: Users, background: "#E7F5E8", accent: "#6DAA79" },
    { title: "Total Products", value: analytics.totalProducts, icon: Package, background: "#F0E7FF", accent: "#A486D5" },
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F2] pb-10">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-[#6DAA79]">Threads & Tassels</p>
          <h1 className="font-serif text-3xl text-[#4A2E1F] sm:text-4xl">Dashboard</h1>
          <p className="mt-2 text-sm text-[#8B817A]">Your store performance at a glance.</p>
        </div>

        <PeriodDropdown value={period} onChange={setPeriod} />
      </div>
            {period === "custom" && (
        <div className="mb-5 flex flex-wrap items-end gap-3 rounded-xl border border-[#EAE2D8] bg-white p-3">
          <div className="min-w-[150px] flex-1">
            <label htmlFor="dashboard-start-date" className="mb-1 block text-xs font-medium text-[#4A2E1F]">From</label>
            <input
              id="dashboard-start-date"
              type="date"
              value={customStart}
              max={todayInIndia()}
              onChange={(event) => setCustomStart(event.target.value)}
              className="w-full rounded-lg border border-[#EAE2D8] bg-[#FFF9F2] px-3 py-2 text-sm text-[#4A2E1F] outline-none focus:border-[#E98282]"
            />
          </div>
          <div className="min-w-[150px] flex-1">
            <label htmlFor="dashboard-end-date" className="mb-1 block text-xs font-medium text-[#4A2E1F]">To</label>
            <input
              id="dashboard-end-date"
              type="date"
              value={customEnd}
              min={customStart || undefined}
              max={todayInIndia()}
              onChange={(event) => setCustomEnd(event.target.value)}
              className="w-full rounded-lg border border-[#EAE2D8] bg-[#FFF9F2] px-3 py-2 text-sm text-[#4A2E1F] outline-none focus:border-[#E98282]"
            />
          </div>
          {invalidCustomRange && <p className="w-full text-xs text-red-600">Please select a valid date range.</p>}
        </div>
      )}

      {analyticsError && (
        <div role="alert" className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={19} className="shrink-0" /> {analyticsError}
        </div>
      )}

      <div className="mb-7 grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
        {stats.map((stat) => <StatCard key={stat.title} {...stat} loading={loadingAnalytics} />)}
      </div>

      <div className="mb-7 grid gap-6 lg:grid-cols-2">
        <CategoryChart categoryStats={categoryStats} loading={loadingAnalytics} />
        <DashboardBanner />
      </div>

      <RecentOrders orders={recentOrders} loading={loadingOrders} error={ordersError} />
    </div>
  );
}

