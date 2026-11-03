
import { useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const categories = [
  { id: 1, name: "Cotton", image: "/images/categories/cotton.jpg" },
  { id: 2, name: "Linen", image: "/images/categories/linen.jpg" },
  { id: 3, name: "Silk", image: "/images/categories/silk.jpg" },
  { id: 4, name: "Georgette", image: "/images/categories/georgette.jpg" },
  { id: 5, name: "Chanderi", image: "/images/categories/chanderi.jpg" },
  { id: 6, name: "Mixed Fabrics", image: "/images/categories/mixed.jpg" },
];

function CategorySection() {
  const scrollRef = useRef(null);

  const scrollCategories = (direction) => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: direction * 320,
      behavior: "smooth",
    });
  };

  return (
   <section className="w-full bg-sand/40 py-8 sm:py-12 lg:py-14">
      <div className="mx-auto max-w-[1450px] px-4 sm:px-6 lg:px-10">

        <div className="flex flex-col gap-7 lg:flex-row lg:items-center">

          {/* Left heading */}
          <div className="shrink-0 lg:w-[260px] xl:w-[300px]">

            {/* <div className="mb-3 h-[1px] w-20 bg-gold" />

            <h2 className="font-serif text-3xl text-chocolate sm:text-4xl">
              Shop by Category
            </h2> */}
            
<div className="mb-3 flex items-center gap-2">
  <span className="h-px w-12 bg-gold" />
  <span className="text-gold text-lg">✦</span>
  <span className="h-px w-6 bg-gold/50" />
</div>

<h2 className="font-serif text-3xl font-normal tracking-tight text-chocolate sm:text-4xl">
  Shop by Category
</h2>


            <p className="mt-3 max-w-xs text-xs leading-6 text-chocolate/65 sm:text-sm">
              Explore our curated collection of salwar materials and fabrics.
            </p>

            <a
              href="/categories"
             className="mt-5 inline-flex items-center gap-3 rounded-full border border-gold px-6 py-2.5 text-xs font-medium tracking-wide text-chocolate transition-all duration-300 hover:border-chocolate hover:bg-chocolate hover:text-white"
            >
              VIEW ALL
              <ArrowRight size={15} />
            </a>

          </div>

          {/* Right carousel */}
          <div className="min-w-0 flex-1">

            {/* Navigation arrows */}
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

            {/* Scrollable cards */}
            <div
              ref={scrollRef}
              className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 sm:gap-4"
              style={{ scrollbarWidth: "none" }}
            >
              {categories.map((category) => (
                <a
                  key={category.id}
                  href={`/categories/${encodeURIComponent(category.name)}`}
                  className="group w-[140px] shrink-0 snap-start overflow-hidden rounded-xl border border-gold/15 bg-offwhite p-2 shadow-[0_3px_12px_rgba(74,46,31,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_8px_24px_rgba(74,46,31,0.10)] sm:w-[165px]"
                >
                  <div className="aspect-square overflow-hidden rounded-lg">
                    <img
                      src={category.image}
                      alt={`${category.name} salwar materials`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>

                  <div className="flex items-center justify-center gap-2 py-2.5">
                   <span className="font-serif text-sm font-medium text-chocolate sm:text-base">
  {category.name}
</span>

                    <ArrowRight
                      size={14}
                      className="text-gold transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </div>
                </a>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default CategorySection;
