import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, UploadCloud, X, Check, ChevronDown, Loader2, ImagePlus } from "lucide-react";
import api from "../../services/api";

const initial = { title: "", description: "", category: "", materialType: "", color: "", actualPrice: "", discountPrice: "", stock: "", isTrending: false };

function Field({ label, name, value, onChange, type = "text", placeholder = "", min, step, required = true }) {
  return <label className="block"><span className="mb-2 block text-sm font-medium text-[#4A2E1F]">{label}{required && <span className="ml-1 text-[#C77E77]">*</span>}</span><input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} min={min} step={step} required={required} className="w-full rounded-xl border border-[#EAE2D8] bg-white px-4 py-3 text-sm text-[#4A2E1F] outline-none transition focus:border-[#C9A46A] focus:ring-2 focus:ring-[#C9A46A]/15" /></label>;
}

export default function AddProduct() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [form, setForm] = useState(initial);
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState("");
  const [dragging, setDragging] = useState(false);

  useEffect(() => () => images.forEach((item) => URL.revokeObjectURL(item.preview)), [images]);

  const change = (event) => setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));

  function addFiles(files) {
    const chosen = Array.from(files || []);
    if (!chosen.length) return;
    setError("");
    const valid = chosen.filter((file) => file.type.startsWith("image/"));
    if (valid.length !== chosen.length) { setError("Only image files are allowed."); return; }
    if (valid.length + images.length > 3) { setError("You can upload a maximum of 3 product images."); return; }
    setImages((prev) => [...prev, ...valid.map((file) => ({ file, preview: URL.createObjectURL(file), id: `${Date.now()}-${Math.random()}` }))]);
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeImage(id) {
    setImages((prev) => prev.filter((item) => item.id !== id));
  }

  async function submit(event) {
    event.preventDefault();
    if (saving) return;
    setError("");
    const actualPrice = Number(form.actualPrice);
    const discountPrice = Number(form.discountPrice);
    const stock = Number(form.stock);
    if (!form.title.trim() || !form.description.trim() || !form.category.trim() || !form.materialType.trim() || !form.color.trim()) { setError("Complete all required product fields."); return; }
    if ([actualPrice, discountPrice, stock].some((value) => !Number.isFinite(value) || value < 0) || !Number.isInteger(stock)) { setError("Enter valid non-negative prices and a whole-number stock quantity."); return; }
    if (discountPrice > actualPrice) { setError("Discount price cannot exceed actual price."); return; }
    if (images.length < 1 || images.length > 3) { setError("Select between 1 and 3 product images."); return; }
    setSaving(true);
    try {
      const urls = [];
      for (let i = 0; i < images.length; i += 1) {
        setUploadProgress(`Uploading image ${i + 1} of ${images.length}...`);
        const data = new FormData();
        data.append("image", images[i].file);
        const response = await api.post("/upload", data);
        const url = response.data?.image?.url;
        if (!url) throw new Error("Image upload succeeded without a URL.");
        urls.push(url);
      }
      setUploadProgress("Saving product...");
      await api.post("/products", {
        title: form.title.trim(), description: form.description.trim(), category: form.category.trim(),
        materialType: form.materialType.trim(), color: form.color.trim(), actualPrice, discountPrice, stock,
        images: urls, isTrending: form.isTrending,
      });
      navigate("/admin/products", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to create product. Please try again.");
    } finally {
      setSaving(false);
      setUploadProgress("");
    }
  }

  return <div className="min-h-screen bg-[#FFF9F2] pb-12 text-[#4A2E1F]">
    <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
      <div><Link to="/admin/products" className="mb-4 inline-flex items-center gap-2 text-sm text-[#8B817A] transition hover:text-[#C77E77]"><ArrowLeft size={17} /> Back to Products</Link><p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-[#6DAA79]">Threads & Tassels</p><h1 className="font-serif text-3xl sm:text-4xl">Add Product</h1><p className="mt-2 text-sm text-[#8B817A]">Create a new product for your boutique.</p></div>
    </div>
    <form onSubmit={submit} className="mx-auto max-w-5xl space-y-6">
      <section className="rounded-2xl border border-[#EAE2D8] bg-[#FFFCF8] p-5 shadow-sm sm:p-7"><h2 className="mb-1 font-serif text-xl">Product Information</h2><p className="mb-6 text-xs text-[#8B817A]">Enter the details customers will see.</p><div className="space-y-5"><Field label="Product Title" name="title" value={form.title} onChange={change} placeholder="e.g. Premium Cotton Salwar Material"/><label className="block"><span className="mb-2 block text-sm font-medium">Description <span className="text-[#C77E77]">*</span></span><textarea name="description" value={form.description} onChange={change} rows={5} required placeholder="Describe the fabric and product details..." className="w-full resize-y rounded-xl border border-[#EAE2D8] bg-white px-4 py-3 text-sm outline-none focus:border-[#C9A46A] focus:ring-2 focus:ring-[#C9A46A]/15"/></label><div className="grid gap-5 sm:grid-cols-2"><Field label="Category" name="category" value={form.category} onChange={change} placeholder="e.g. Cotton"/><Field label="Material Type" name="materialType" value={form.materialType} onChange={change} placeholder="e.g. Pure Cotton"/></div><Field label="Color" name="color" value={form.color} onChange={change} placeholder="e.g. Dusty Rose"/></div></section>
      <section className="rounded-2xl border border-[#EAE2D8] bg-[#FFFCF8] p-5 shadow-sm sm:p-7"><h2 className="mb-1 font-serif text-xl">Pricing & Inventory</h2><p className="mb-6 text-xs text-[#8B817A]">Set permanent prices here. Global offers are managed separately.</p><div className="grid gap-5 sm:grid-cols-2"><Field label="Actual Price (₹)" name="actualPrice" type="number" min="0" step="0.01" value={form.actualPrice} onChange={change} placeholder="1800"/><Field label="Discount Price (₹)" name="discountPrice" type="number" min="0" step="0.01" value={form.discountPrice} onChange={change} placeholder="1499"/></div><div className="mt-5 max-w-sm"><Field label="Stock Quantity" name="stock" type="number" min="0" step="1" value={form.stock} onChange={change} placeholder="15"/></div></section>
      <section className="rounded-2xl border border-[#EAE2D8] bg-[#FFFCF8] p-5 shadow-sm sm:p-7"><h2 className="mb-1 font-serif text-xl">Product Images</h2><p className="mb-5 text-xs text-[#8B817A]">Upload 1–3 images. The first image will be the product thumbnail.</p><input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(event) => addFiles(event.target.files)}/><button type="button" disabled={saving || images.length >= 3} onClick={() => inputRef.current?.click()} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); addFiles(event.dataTransfer.files); }} className={`flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-9 text-center transition ${dragging ? "border-[#C77E77] bg-[#FFF0DB]" : "border-[#E7D5C4] bg-[#FFF9F2] hover:border-[#C9A46A]"} disabled:cursor-not-allowed disabled:opacity-60`}><span className="mb-3 rounded-xl bg-[#FFE5E5] p-3 text-[#C77E77]"><ImagePlus size={25}/></span><span className="text-sm font-medium">Choose product images</span><span className="mt-1 text-xs text-[#8B817A]">Or drag and drop here · {images.length}/3 selected</span></button>{images.length > 0 && <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-5">{images.map((item, index) => <div key={item.id} className="relative aspect-square overflow-hidden rounded-xl border border-[#EAE2D8] bg-white"><img src={item.preview} alt={`Product preview ${index + 1}`} className="h-full w-full object-cover"/>{index === 0 && <span className="absolute bottom-1 left-1 rounded-md bg-[#4A2E1F]/80 px-2 py-1 text-[10px] text-white">Cover</span>}<button type="button" disabled={saving} onClick={() => removeImage(item.id)} aria-label={`Remove image ${index + 1}`} className="absolute right-1 top-1 rounded-full bg-white p-1 text-[#4A2E1F] shadow"><X size={14}/></button></div>)}</div>}</section>
      <section className="rounded-2xl border border-[#EAE2D8] bg-[#FFFCF8] p-5 shadow-sm sm:p-7"><label className="flex cursor-pointer items-center justify-between gap-4"><div><h2 className="font-serif text-xl">Trending Product</h2><p className="mt-1 text-xs text-[#8B817A]">Show this product in your trending collection.</p></div><input type="checkbox" checked={form.isTrending} onChange={(event) => setForm((prev) => ({ ...prev, isTrending: event.target.checked }))} className="h-5 w-5 accent-[#C77E77]"/></label></section>
      {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <div className="flex flex-wrap items-center justify-end gap-3"><Link to="/admin/products" className="rounded-xl border border-[#EAE2D8] bg-white px-5 py-3 text-sm font-medium hover:bg-[#FFF0DB]">Cancel</Link><button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C77E77] px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#B96C66] disabled:cursor-not-allowed disabled:opacity-60">{saving ? <Loader2 size={17} className="animate-spin"/> : <Check size={17}/>} {saving ? uploadProgress || "Saving..." : "Create Product"}</button></div>
    </form>
  </div>;
}
