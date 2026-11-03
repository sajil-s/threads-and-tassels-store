import { useEffect, useRef, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { createPortal } from "react-dom";
import { ArrowLeft, X, Check, Loader2, ImagePlus, Trash2, AlertTriangle } from "lucide-react";
import api from "../../services/api";

const emptyForm = { title: "", description: "", category: "", materialType: "", color: "", actualPrice: "", discountPrice: "", stock: "", isTrending: false };
const inputStyle = "w-full rounded-xl border border-[#EAE2D8] bg-white px-4 py-3 text-sm text-[#4A2E1F] outline-none transition focus:border-[#C9A46A] focus:ring-2 focus:ring-[#C9A46A]/15";
const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

function Field({ label, name, value, onChange, type = "text", placeholder = "", min, step }) {
  return <label className="block"><span className="mb-2 block text-sm font-medium text-[#4A2E1F]">{label}<span className="ml-1 text-[#C77E77]">*</span></span><input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} min={min} step={step} required className={inputStyle} /></label>;
}

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const previewsRef = useRef([]);
  const deleteCancelRef = useRef(null);
  const deleteConfirmRef = useRef(null);
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    api.get(`/products/admin/${id}`)
      .then(({ data }) => {
        if (!active) return;
        const p = data.product;
        if (!p) throw new Error("Product not found.");
        setForm({
          title: p.title ?? "", description: p.description ?? "", category: p.category ?? "",
          materialType: p.materialType ?? "", color: p.color ?? "",
          actualPrice: String(p.actualPrice ?? ""), discountPrice: String(p.discountPrice ?? ""),
          stock: String(p.stock ?? ""), isTrending: Boolean(p.isTrending),
        });
        setImages((p.images || []).map((url, index) => ({ id: `existing-${index}`, url: String(url).trim(), existing: true })));
      })
      .catch((err) => { if (active) setError(err.response?.data?.message || err.message || "Unable to load product."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  useEffect(() => () => { previewsRef.current.forEach((url) => URL.revokeObjectURL(url)); }, []);

  useEffect(() => {
    if (!confirmDelete) return;
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    deleteCancelRef.current?.focus();

    function onKeyDown(event) {
      if (event.key === "Escape" && !deleting) {
        setConfirmDelete(false);
      }
      if (event.key === "Tab") {
        const first = deleteCancelRef.current;
        const last = deleteConfirmRef.current;
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [confirmDelete, deleting]);

  const change = (event) => setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));

  function addFiles(fileList) {
    if (saving || deleting) return;
    const chosen = Array.from(fileList || []);
    if (!chosen.length) return;
    setError("");
    if (images.length + chosen.length > 3) { setError("A product can have at most 3 images."); return; }
    if (chosen.some((file) => !allowedTypes.includes(file.type))) { setError("Only JPEG, PNG, and WebP images are allowed."); return; }
    if (chosen.some((file) => file.size > MAX_SIZE)) { setError("Each image must be 5 MB or smaller."); return; }
    const next = chosen.map((file) => {
      const preview = URL.createObjectURL(file);
      previewsRef.current.push(preview);
      return { id: `new-${crypto.randomUUID()}`, file, preview, existing: false };
    });
    setImages((prev) => [...prev, ...next]);
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeImage(imageId) {
    setImages((prev) => {
      const removed = prev.find((item) => item.id === imageId);
      if (removed?.preview) {
        URL.revokeObjectURL(removed.preview);
        previewsRef.current = previewsRef.current.filter((url) => url !== removed.preview);
      }
      return prev.filter((item) => item.id !== imageId);
    });
  }

  async function submit(event) {
    event.preventDefault();
    if (saving || deleting) return;
    setError("");
    const actualPrice = Number(form.actualPrice);
    const discountPrice = Number(form.discountPrice);
    const stock = Number(form.stock);
    if (["title", "description", "category", "materialType", "color"].some((key) => !form[key].trim())) { setError("Complete all required product fields."); return; }
    if (["actualPrice", "discountPrice", "stock"].some((key) => String(form[key]).trim() === "") ||
        [actualPrice, discountPrice, stock].some((v) => !Number.isFinite(v) || v < 0) || !Number.isInteger(stock)) {
      setError("Enter valid non-negative prices and a whole-number stock quantity."); return;
    }
    if (discountPrice > actualPrice) { setError("Discount price cannot exceed actual price."); return; }
    if (images.length < 1 || images.length > 3) { setError("Keep between 1 and 3 product images."); return; }
    setSaving(true);
    try {
      const urls = [];
      for (let i = 0; i < images.length; i += 1) {
        const item = images[i];
        if (item.existing) { urls.push(item.url); continue; }
        setProgress(`Uploading image ${i + 1} of ${images.length}...`);
        const data = new FormData();
        data.append("image", item.file);
        const response = await api.post("/upload", data);
        const url = response.data?.image?.url;
        if (!url) throw new Error("Image upload succeeded without a URL.");
        urls.push(url);
      }
      setProgress("Saving changes...");
      await api.patch(`/products/${id}`, {
        title: form.title.trim(), description: form.description.trim(), category: form.category.trim(),
        materialType: form.materialType.trim(), color: form.color.trim(), actualPrice, discountPrice, stock,
        images: urls, isTrending: form.isTrending,
      });
      navigate("/admin/products", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to update product.");
    } finally {
      setSaving(false);
      setProgress("");
    }
  }

  async function deleteProduct() {
    if (deleting || saving) return;
    setDeleting(true);
    setError("");
    try {
      await api.delete(`/products/${id}`);
      navigate("/admin/products", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete product.");
      setConfirmDelete(false);
    } finally { setDeleting(false); }
  }

  if (loading) return <div className="space-y-4 p-5" aria-label="Loading product">{[1, 2, 3].map((i) => <div key={i} className="h-32 animate-pulse rounded-2xl bg-[#FFF0DB]" />)}</div>;
  if (error && !form.title) return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700"><p>{error}</p><Link to="/admin/products" className="mt-4 inline-block underline">Back to Products</Link></div>;

  return <div className="min-h-screen bg-[#FFF9F2] pb-12 text-[#4A2E1F]">
    <div className="mb-7"><Link to="/admin/products" className="mb-4 inline-flex items-center gap-2 text-sm text-[#8B817A] transition hover:text-[#C77E77]"><ArrowLeft size={17} /> Back to Products</Link><p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-[#6DAA79]">Threads & Tassels</p><h1 className="font-serif text-3xl sm:text-4xl">Edit Product</h1><p className="mt-2 text-sm text-[#8B817A]">Update your boutique product details.</p></div>
    <form onSubmit={submit} className="mx-auto max-w-5xl space-y-6">
      <section className="rounded-2xl border border-[#EAE2D8] bg-[#FFFCF8] p-5 shadow-sm sm:p-7"><h2 className="mb-1 font-serif text-xl">Product Information</h2><p className="mb-6 text-xs text-[#8B817A]">Edit the details customers will see.</p><div className="space-y-5"><Field label="Product Title" name="title" value={form.title} onChange={change} /><label className="block"><span className="mb-2 block text-sm font-medium">Description <span className="text-[#C77E77]">*</span></span><textarea name="description" value={form.description} onChange={change} rows={5} required className={`${inputStyle} resize-y`} /></label><div className="grid gap-5 sm:grid-cols-2"><Field label="Category" name="category" value={form.category} onChange={change} /><Field label="Material Type" name="materialType" value={form.materialType} onChange={change} /></div><Field label="Color" name="color" value={form.color} onChange={change} /></div></section>
      <section className="rounded-2xl border border-[#EAE2D8] bg-[#FFFCF8] p-5 shadow-sm sm:p-7"><h2 className="mb-1 font-serif text-xl">Pricing & Inventory</h2><p className="mb-6 text-xs text-[#8B817A]">Permanent prices only. Global offers are managed separately.</p><div className="grid gap-5 sm:grid-cols-2"><Field label="Actual Price (₹)" name="actualPrice" type="number" min="0" step="0.01" value={form.actualPrice} onChange={change} /><Field label="Discount Price (₹)" name="discountPrice" type="number" min="0" step="0.01" value={form.discountPrice} onChange={change} /></div><div className="mt-5 max-w-sm"><Field label="Stock Quantity" name="stock" type="number" min="0" step="1" value={form.stock} onChange={change} /></div></section>
      <section className="rounded-2xl border border-[#EAE2D8] bg-[#FFFCF8] p-5 shadow-sm sm:p-7"><h2 className="mb-1 font-serif text-xl">Product Images</h2><p className="mb-5 text-xs text-[#8B817A]">Keep 1–3 images. The first image will be shown as the product cover.</p><input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={(event) => addFiles(event.target.files)} /><button type="button" disabled={saving || images.length >= 3} onClick={() => inputRef.current?.click()} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); addFiles(event.dataTransfer.files); }} className={`flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-9 text-center transition ${dragging ? "border-[#C77E77] bg-[#FFF0DB]" : "border-[#E7D5C4] bg-[#FFF9F2] hover:border-[#C9A46A]"} disabled:cursor-not-allowed disabled:opacity-60`}><span className="mb-3 rounded-xl bg-[#FFE5E5] p-3 text-[#C77E77]"><ImagePlus size={25} /></span><span className="text-sm font-medium">Choose replacement or additional images</span><span className="mt-1 text-xs text-[#8B817A]">Or drag and drop here · {images.length}/3 selected</span></button>{images.length > 0 && <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-5">{images.map((item, index) => <div key={item.id} className="relative aspect-square overflow-hidden rounded-xl border border-[#EAE2D8] bg-white"><img src={item.existing ? item.url : item.preview} alt={`Product image ${index + 1}`} className="h-full w-full object-cover" />{index === 0 && <span className="absolute bottom-1 left-1 rounded-md bg-[#4A2E1F]/80 px-2 py-1 text-[10px] text-white">Cover</span>}<button type="button" disabled={saving} onClick={() => removeImage(item.id)} aria-label={`Remove image ${index + 1}`} className="absolute right-1 top-1 rounded-full bg-white p-1 text-[#4A2E1F] shadow"><X size={14} /></button></div>)}</div>}</section>
      <section className="rounded-2xl border border-[#EAE2D8] bg-[#FFFCF8] p-5 shadow-sm sm:p-7"><label className="flex cursor-pointer items-center justify-between gap-4"><div><h2 className="font-serif text-xl">Trending Product</h2><p className="mt-1 text-xs text-[#8B817A]">Show this product in your trending collection.</p></div><input type="checkbox" checked={form.isTrending} onChange={(event) => setForm((prev) => ({ ...prev, isTrending: event.target.checked }))} className="h-5 w-5 accent-[#C77E77]" /></label></section>
      {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <div className="flex flex-wrap items-center justify-between gap-3"><button type="button" disabled={saving || deleting} onClick={() => setConfirmDelete(true)} className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-medium text-red-700 transition hover:bg-red-50"><Trash2 size={17} /> Delete Product</button><div className="flex flex-wrap items-center gap-3"><Link to="/admin/products" className="rounded-xl border border-[#EAE2D8] bg-white px-5 py-3 text-sm font-medium hover:bg-[#FFF0DB]">Cancel</Link><button type="submit" disabled={saving || deleting} className="inline-flex items-center gap-2 rounded-xl bg-[#C77E77] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#B96C66] disabled:opacity-60">{saving ? <Loader2 size={17} className="animate-spin" /> : <Check size={17} />}{saving ? progress || "Saving..." : "Save Changes"}</button></div></div>
    </form>
    {confirmDelete && createPortal(
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-[#2B1B13]/60 p-4 backdrop-blur-[5px]"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget && !deleting) setConfirmDelete(false);
        }}
      >
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="delete-product-title"
          aria-describedby="delete-product-description"
          className="my-auto w-full max-w-md shrink-0 rounded-2xl border border-[#EAE2D8] bg-[#FFFCF8] p-5 shadow-2xl sm:p-7"
        >
          <div className="mb-4 inline-flex rounded-xl bg-red-50 p-3 text-red-600">
            <AlertTriangle size={24} />
          </div>
          <h2 id="delete-product-title" className="font-serif text-2xl text-[#4A2E1F]">
            Delete this product?
          </h2>
          <p id="delete-product-description" className="mt-3 break-words text-sm leading-6 text-[#8B817A]">
            Are you sure you want to delete <strong className="text-[#4A2E1F]">{form.title}</strong>?
            This action is permanent and cannot be undone.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              ref={deleteCancelRef}
              type="button"
              disabled={deleting}
              onClick={() => setConfirmDelete(false)}
              className="min-h-11 rounded-xl border border-[#EAE2D8] bg-white px-3 py-3 text-sm font-medium text-[#4A2E1F] transition hover:bg-[#FFF0DB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C77E77] disabled:opacity-60"
            >
              Keep Product
            </button>
            {/* <button
              ref={deleteConfirmRef}
              type="button"
              disabled={deleting}
              onClick={deleteProduct}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#C43D3D] px-3 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#A82E2E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C43D3D] disabled:opacity-60"
            >
              {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              {deleting ? "Deleting..." : "Delete Product"}
            </button> */}
            
<button
  ref={deleteConfirmRef}
  type="button"
  disabled={deleting}
  onClick={deleteProduct}
  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#C77E77] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#B96C66] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C77E77] disabled:cursor-not-allowed disabled:opacity-60"
>
  {deleting ? (
    <Loader2 size={16} className="animate-spin" />
  ) : (
    <Trash2 size={16} />
  )}
  {deleting ? "Deleting..." : "Delete Product"}
</button>

          </div>
        </div>
      </div>,
      document.body
    )}
  </div>;
}
