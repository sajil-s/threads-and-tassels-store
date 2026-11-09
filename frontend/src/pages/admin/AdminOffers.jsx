import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Loader2, Percent, Tag, Save } from "lucide-react";
import api from "../../services/api";

export default function AdminOffers() {
  const [percentage, setPercentage] = useState("10");
  const [isActive, setIsActive] = useState(false);
  const [saved, setSaved] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get("/offers");
        if (!mounted) return;
        const offer = data.offer;
        if (!offer) throw new Error("Offer settings are unavailable.");
        setPercentage(String(offer.percentage));
        setIsActive(Boolean(offer.isActive));
        setSaved({ percentage: offer.percentage, isActive: Boolean(offer.isActive) });
      } catch (err) {
        if (mounted) setError(err.response?.data?.message || err.message || "Could not load offer settings.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const numericPercentage = Number(percentage);
  const valid = percentage.trim() !== "" && Number.isInteger(numericPercentage) && numericPercentage >= 1 && numericPercentage <= 100;
  const dirty = saved && (numericPercentage !== saved.percentage || isActive !== saved.isActive);

  async function saveOffer(event) {
    event.preventDefault();
    if (!valid || saving) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const { data } = await api.patch("/offers/admin", { percentage: numericPercentage, isActive });
      const updated = data.offer;
      setSaved({ percentage: updated.percentage, isActive: updated.isActive });
      setPercentage(String(updated.percentage));
      setIsActive(updated.isActive);
      setNotice("Offer settings saved successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save offer settings. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF9F2] pb-12 text-[#4A2E1F]">
      <div className="mb-7">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-[#6DAA79]">Threads & Tassels</p>
        <h1 className="font-serif text-3xl sm:text-4xl">Offers</h1>
        <p className="mt-2 text-sm text-[#8B817A]">Manage the special offer shown across your store.</p>
      </div>

      {error && <div role="alert" className="mb-5 flex items-start gap-2 rounded-xl border border-[#F3D5D5] bg-[#FFF0F0] p-4 text-sm text-[#A63F42]"><AlertCircle size={18} className="shrink-0" />{error}</div>}
      {notice && <div role="status" className="mb-5 flex items-start gap-2 rounded-xl border border-[#D4E7D5] bg-[#E7F5E8] p-4 text-sm text-[#34754A]"><CheckCircle2 size={18} className="shrink-0" />{notice}</div>}

      {loading ? <div className="grid gap-5 lg:grid-cols-2"><div className="h-80 animate-pulse rounded-2xl bg-[#FFF0DB]" /><div className="h-80 animate-pulse rounded-2xl bg-[#FFF0DB]" /></div> : (
        <div className="grid items-start gap-5 lg:grid-cols-2">
          <form onSubmit={saveOffer} className="rounded-2xl border border-[#EAE2D8] bg-[#FFFCF8] p-5 shadow-[0_5px_20px_rgba(74,46,31,0.035)] sm:p-7">
            <div className="mb-6 flex items-center gap-3"><span className="rounded-xl bg-[#FFF0DB] p-3 text-[#A36A19]"><Tag size={21} /></span><div><h2 className="font-serif text-xl">Special Offer Settings</h2><p className="mt-1 text-xs text-[#8B817A]">Set the discount and choose when it appears.</p></div></div>
            <label htmlFor="offer-percentage" className="mb-2 block text-sm font-medium">Discount Percentage</label>
            <div className="relative max-w-xs"><input id="offer-percentage" type="number" min="1" max="100" step="1" inputMode="numeric" value={percentage} onChange={(e) => { setPercentage(e.target.value); setNotice(""); }} className="w-full rounded-xl border border-[#EAE2D8] bg-white px-4 py-3 pr-12 text-base outline-none transition focus:border-[#C9A46A] focus:ring-2 focus:ring-[#C9A46A]/20" /><Percent size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8B817A]" /></div>
            {!valid && <p className="mt-2 text-xs text-[#A63F42]">Enter a whole number from 1 to 100.</p>}
            <p className="mt-2 text-xs leading-5 text-[#8B817A]">This discount is applied to the existing discounted product price while the offer is active.</p>
            <div className="my-6 h-px bg-[#EAE2D8]" />
            <div className="flex items-center justify-between gap-4"><div><p className="text-sm font-semibold">Enable Special Offer</p><p className="mt-1 text-xs leading-5 text-[#8B817A]">Show the offer banner and activate the discount.</p></div><button type="button" role="switch" aria-checked={isActive} aria-label="Enable special offer" onClick={() => { setIsActive((v) => !v); setNotice(""); }} className={`relative h-8 w-14 shrink-0 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C77E77] ${isActive ? "bg-[#8FA580]" : "bg-[#D8D2CC]"}`}><span className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${isActive ? "translate-x-6" : "translate-x-0"}`} /></button></div>
            <button type="submit" disabled={!valid || saving || !dirty} className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#C77E77] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#B96C66] disabled:cursor-not-allowed disabled:opacity-50">{saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}{saving ? "Saving..." : "Save Changes"}</button>
            {saved && <p className="mt-3 text-center text-xs text-[#8B817A]">Current saved status: <span className="font-semibold">{saved.isActive ? `Active · ${saved.percentage}% off` : "Inactive"}</span></p>}
          </form>

          <section className="rounded-2xl border border-[#EAE2D8] bg-[#FFFCF8] p-5 shadow-[0_5px_20px_rgba(74,46,31,0.035)] sm:p-7">
            <div className="mb-5 flex items-center justify-between gap-3"><div><h2 className="font-serif text-xl">Offer Preview</h2><p className="mt-1 text-xs text-[#8B817A]">Preview only — save to publish changes.</p></div><span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${isActive ? "bg-[#E7F5E8] text-[#34754A]" : "bg-[#ECE9E6] text-[#6B625D]"}`}>{isActive ? "Enabled" : "Disabled"}</span></div>
            <div className="relative flex min-h-64 flex-col items-center justify-center overflow-hidden rounded-2xl border border-[#EAD6C9] bg-gradient-to-br from-[#FFE5E5] via-[#FFF0DB] to-[#F0E7FF] px-6 py-10 text-center"><span className="mb-3 rounded-full border border-[#C9A46A]/40 bg-white/65 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8B6550]">Threads & Tassels</span><h3 className="font-serif text-4xl font-semibold sm:text-5xl">{valid ? numericPercentage : "—"}% OFF</h3><p className="mt-3 max-w-xs text-sm text-[#745B4E]">A little something special, just for you.</p><span className="mt-6 rounded-xl bg-[#4A2E1F] px-5 py-2.5 text-xs font-semibold text-white">Explore Now</span>{!isActive && <div className="absolute inset-0 flex items-center justify-center bg-[#FFFCF8]/65 backdrop-blur-[2px]"><span className="rounded-full border border-[#EAE2D8] bg-white px-5 py-2 text-sm font-semibold shadow-sm">Offer is currently off</span></div>}</div>
            <p className="mt-4 text-xs leading-5 text-[#8B817A]">This is an illustrative preview. Your homepage uses its existing offer banner artwork.</p>
          </section>
        </div>
      )}
    </div>
  );
}
