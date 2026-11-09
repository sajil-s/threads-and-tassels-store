import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Layers3 } from "lucide-react";

import { getCategories } from "../../services/categoryApi";
import FlowerLoader from "../common/FlowerLoader";

function CategorySection() {
  const scrollRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      setLoading(true);
      setError("");

      try {
        const data = await getCategories();
        if (active) setCategories(Array.isArray(data.categories) ? data.categories : []);
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || "Unable to load categories.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadCategories();
    return () => { active = false; };
  }, [retryCount]);

  function scrollCategories(direction) {
    scrollRef.current?.scrollBy({ left: direction * 320, behavior: "smooth" });
  }

  return (
    <section className="w-full bg-sand/40 py-8 sm:py-12 lg:py-14">
      <div className="mx-auto max-w-[1450px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-center">
          <div className="shrink-0 lg:w-[260px] xl:w-[300px]">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-px w-12 bg-gold" />
              <span className="text-lg text-gold">✦</span>
              <span className="h-px w-6 bg-gold/50" />
            </div>
            <h2 className="font-serif text-3xl font-normal tracking-tight text-chocolate sm:text-4xl">
              Shop by Category
            </h2>
            <p className="mt-3 max-w-xs text-xs leading-6 text-chocolate/65 sm:text-sm">
              Explore our curated collection of salwar materials and fabrics.
            </p>
            <Link
              to="/categories"
              className="mt-5 inline-flex items-center gap-3 rounded-full border border-gold px-6 py-2.5 text-xs font-medium tracking-wide text-chocolate transition-all duration-300 hover:border-chocolate hover:bg-chocolate hover:text-white"
            >
              VIEW ALL <ArrowRight size={15} />
            </Link>
          </div>

          <div className="min-w-0 flex-1">
            {!loading && !error && categories.length > 0 && (
              <div className="mb-3 hidden justify-end gap-2 lg:flex">
                <button
                  type="button"
                  aria-label="Scroll categories left"
                  onClick={() => scrollCategories(-1)}
                  className="rounded-full border border-gold/40 p-2 text-chocolate transition-colors hover:bg-gold hover:text-white"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  aria-label="Scroll categories right"
                  onClick={() => scrollCategories(1)}
                  className="rounded-full border border-gold/40 p-2 text-chocolate transition-colors hover:bg-gold hover:text-white"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}

            {loading ? (
              <div className="flex min-h-[210px] items-center justify-center">
                <FlowerLoader variant="section" label="Loading categories" />
              </div>
            ) : error ? (
              <div className="flex min-h-[180px] flex-col items-center justify-center gap-4 text-center">
                <p role="alert" className="text-sm text-chocolate/70">{error}</p>
                <button
                  type="button"
                  onClick={() => setRetryCount((count) => count + 1)}
                  className="rounded-full border border-gold px-5 py-2 text-sm text-chocolate transition-colors hover:bg-gold/15"
                >
                  Try Again
                </button>
              </div>
            ) : categories.length === 0 ? (
              <p className="py-16 text-center text-sm text-chocolate/65">
                No categories available at the moment.
              </p>
            ) : (
              <div
                ref={scrollRef}
                className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 sm:gap-4"
                style={{ scrollbarWidth: "none" }}
              >
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    to={`/products?category=${encodeURIComponent(category.name)}`}
                    className="group w-[140px] shrink-0 snap-start overflow-hidden rounded-xl border border-gold/15 bg-offwhite p-2 shadow-[0_3px_12px_rgba(74,46,31,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_8px_24px_rgba(74,46,31,0.10)] sm:w-[165px]"
                  >
                    <div className="aspect-square overflow-hidden rounded-lg bg-[#F1EBE2]">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={`${category.name} salwar materials`}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Layers3 size={36} strokeWidth={1.2} className="text-gold/60" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-center gap-2 py-2.5">
                      <span className="truncate font-serif text-sm font-medium text-chocolate sm:text-base">
                        {category.name}
                      </span>
                      <ArrowRight
                        size={14}
                        className="shrink-0 text-gold transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CategorySection;
