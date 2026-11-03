import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Pencil, ChevronLeft, ChevronRight, Package, ImageOff, ArrowDownUp, ChevronDown, Check } from "lucide-react";
import api from "../../services/api";

const PAGE_SIZE = 10;
const formatINR = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

function ProductImage({ src, title }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#FFF0DB] sm:h-16 sm:w-16">
      {src && !failed ? (
        <img src={src.trim()} alt={title} className="h-full w-full object-cover" onError={() => setFailed(true)} />
      ) : (
        <ImageOff size={22} className="text-[#C9A46A]" />
      )}
    </div>
  );
}

function StockValue({ stock }) {
  const quantity = Number(stock) || 0;
  const colors = quantity === 0
    ? "bg-[#FFE5E5] text-[#A63F42]"
    : quantity <= 5
      ? "bg-[#FFF0DB] text-[#A36A19]"
      : "bg-[#E7F5E8] text-[#34754A]";
  return <span className={`inline-flex min-w-12 justify-center rounded-full px-3 py-1.5 text-xs font-semibold tabular-nums ${colors}`}>{quantity}</span>;
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "priceLow", label: "Price: Low to High" },
  { value: "priceHigh", label: "Price: High to Low" },
  { value: "stockLow", label: "Stock: Low to High" },
  { value: "stockHigh", label: "Stock: High to Low" },
];

function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const selected = SORT_OPTIONS.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event) {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    }
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative w-full sm:w-auto">
      <button
        ref={triggerRef}
        type="button"
        aria-label="Sort products"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((previous) => !previous)}
        className={`flex w-full items-center justify-between gap-3 rounded-xl border bg-white px-4 py-2.5 text-sm font-medium text-[#4A2E1F] shadow-sm transition hover:border-[#C9A46A] hover:bg-[#FFFCF8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A46A]/40 sm:w-auto ${open ? "border-[#C9A46A]" : "border-[#EAE2D8]"}`}
      >
        <ArrowDownUp size={16} className="shrink-0 text-[#C77E77]" />
        <span className="flex-1 text-left">{selected?.label || "Sort Products"}</span>
        <ChevronDown size={16} className={`shrink-0 text-[#8B817A] transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-full min-w-[235px] origin-top-right rounded-2xl border border-[#EAE2D8] bg-white p-2 shadow-[0_16px_40px_rgba(74,46,31,0.14)] sm:w-[245px]">
          <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#A7A7A5]">Sort Products</p>
          <div className="space-y-0.5">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                  triggerRef.current?.focus();
                }}
                className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A46A]/40 ${value === option.value ? "bg-[#FFF0E9] font-semibold text-[#9C5B4B]" : "text-[#4A2E1F] hover:bg-[#FFF9F2]"}`}
              >
                <span>{option.label}</span>
                {value === option.value && <Check size={16} className="shrink-0 text-[#C77E77]" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/products/admin/all", {
          params: { page, limit: PAGE_SIZE, sort, ...(search ? { search } : {}) },
        });
        if (!active) return;
        setProducts(data.products || []);
        setTotalProducts(data.totalProducts || 0);
        setTotalPages(data.totalPages || 0);
      } catch (err) {
        if (!active) return;
        setError(err.response?.data?.message || "Unable to load products. Please try again.");
        setProducts([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [page, sort, search]);

  const first = totalProducts === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const last = Math.min(page * PAGE_SIZE, totalProducts);

  return (
    <div className="min-h-screen bg-[#FFF9F2] pb-10 text-[#4A2E1F]">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-[#6DAA79]">Threads & Tassels</p>
          <h1 className="font-serif text-3xl sm:text-4xl">Products</h1>
          <p className="mt-2 text-sm text-[#8B817A]">Manage your store products here.</p>
        </div>
        <Link to="/admin/products/new" className="inline-flex items-center gap-2 rounded-xl bg-[#C77E77] px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#B96C66]">
          <Plus size={18} /> Add Product
        </Link>
      </div>

      <section className="overflow-hidden rounded-2xl border border-[#EAE2D8] bg-[#FFFCF8] shadow-[0_5px_20px_rgba(74,46,31,0.035)]">
        <div className="flex flex-col gap-3 border-b border-[#EAE2D8] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <label className="relative block w-full sm:max-w-sm">
            <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#A7A7A5]" />
            <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search products..." aria-label="Search products" className="w-full rounded-xl border border-[#EAE2D8] bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#C9A46A]" />
          </label>
          <SortDropdown value={sort} onChange={(nextSort) => { setSort(nextSort); setPage(1); }} />
        </div>

        {error && <div role="alert" className="m-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        {loading ? (
          <div className="space-y-3 p-5">{Array.from({ length: 5 }, (_, i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-[#FAF7F1]" />)}</div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-5 py-16 text-center">
            <Package size={35} className="text-[#C9A46A]" />
            <p className="font-medium">No products found</p>
            <p className="text-sm text-[#8B817A]">{search ? "Try a different search term." : "Add your first product to get started."}</p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[740px] text-left text-sm">
                <thead className="bg-[#FFF5EB] text-xs text-[#8B817A]">
                  <tr><th className="px-5 py-4 font-medium">Image</th><th className="px-5 py-4 font-medium">Title</th><th className="px-5 py-4 font-medium">Category</th><th className="px-5 py-4 font-medium">Price</th><th className="px-5 py-4 font-medium">Stock</th><th className="px-5 py-4 font-medium">Edit</th></tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-t border-[#EAE2D8] transition hover:bg-[#FFF9F2]">
                      <td className="px-5 py-3"><ProductImage src={product.images?.[0]} title={product.title} /></td>
                      <td className="max-w-[290px] px-5 py-3 font-medium"><span className="line-clamp-2">{product.title}</span></td>
                      <td className="px-5 py-3"><span className="inline-flex rounded-full bg-[#F0E7FF] px-3 py-1.5 text-xs text-[#74569B]">{product.category}</span></td>
                      <td className="whitespace-nowrap px-5 py-3"><div className="font-semibold">{formatINR(product.discountPrice)}</div>{product.actualPrice > product.discountPrice && <div className="text-xs text-[#A7A7A5] line-through">{formatINR(product.actualPrice)}</div>}</td>
                      <td className="px-5 py-3"><StockValue stock={product.stock} /></td>
                      <td className="px-5 py-3"><Link to={`/admin/products/${product._id}/edit`} className="inline-flex items-center gap-2 rounded-lg border border-[#EAE2D8] bg-white px-3 py-2 text-xs font-medium transition hover:border-[#C9A46A]"><Pencil size={14} /> Edit</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="divide-y divide-[#EAE2D8] md:hidden">
              {products.map((product) => (
                <div key={product._id} className="flex gap-3 p-4">
                  <ProductImage src={product.images?.[0]} title={product.title} />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold">{product.title}</p>
                    <p className="mt-1 text-xs text-[#8B817A]">{product.category}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2"><span className="text-sm font-semibold">{formatINR(product.discountPrice)}</span><StockValue stock={product.stock} /></div>
                  </div>
                  <Link to={`/admin/products/${product._id}/edit`} aria-label={`Edit ${product.title}`} className="self-start rounded-lg border border-[#EAE2D8] bg-white p-2"><Pencil size={16} /></Link>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EAE2D8] px-4 py-4 text-xs text-[#8B817A] sm:px-5">
          <span>Showing {first}–{last} of {totalProducts} products</span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1 || loading} aria-label="Previous page" className="rounded-lg border border-[#EAE2D8] bg-white p-2 disabled:opacity-40"><ChevronLeft size={16} /></button>
            <span className="min-w-16 text-center font-medium text-[#4A2E1F]">{page} / {Math.max(totalPages, 1)}</span>
            <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages || loading} aria-label="Next page" className="rounded-lg border border-[#EAE2D8] bg-white p-2 disabled:opacity-40"><ChevronRight size={16} /></button>
          </div>
        </div>
      </section>
    </div>
  );
}
