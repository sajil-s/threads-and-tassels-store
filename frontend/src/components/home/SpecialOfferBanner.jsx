
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { getCurrentOffer } from "../../services/offerApi";

function SpecialOfferBanner() {
  const [offer, setOffer] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadOffer() {
      try {
        const data = await getCurrentOffer();

        if (!cancelled && data.success) {
          setOffer(data.offer);
        }
      } catch (error) {
        console.error("Failed to load offer:", error);
      }
    }

    loadOffer();

    return () => {
      cancelled = true;
    };
  }, []);

  // Completely hide the banner when the admin disables it.
  if (!offer?.isActive) return null;

  return (
    <section className="bg-ivory px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="relative mx-auto min-h-[320px] max-w-7xl overflow-hidden rounded-2xl bg-sand shadow-sm sm:min-h-[360px]">

        {/* Fixed background image */}
        <img
          src="/images/banners/special-offer.jpg"
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* Text readability overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-sand/95 via-sand/85 to-sand/25" />

        <div className="relative z-10 flex min-h-[320px] items-center px-6 py-10 sm:min-h-[360px] sm:px-12 lg:px-20">

          <div className="max-w-lg">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-sage sm:text-xs">
              Exclusive Offer
            </p>

            <h2 className="font-serif text-3xl italic text-chocolate sm:text-4xl lg:text-5xl">
              Special Sale
            </h2>

            <div className="mt-3 flex items-baseline gap-3">
              <span className="font-serif text-5xl text-rose sm:text-6xl lg:text-7xl">
                {offer.percentage}%
              </span>

              <span className="font-serif text-2xl text-gold sm:text-3xl">
                OFF
              </span>
            </div>

            <p className="mt-3 text-sm text-taupe">
              On our beautiful salwar materials
            </p>

            <a
              href="/products"
              className="mt-6 inline-flex items-center gap-3 rounded-full bg-chocolate px-6 py-3 text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-gold"
            >
              Explore Now
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SpecialOfferBanner;
