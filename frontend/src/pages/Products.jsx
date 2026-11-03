
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { getProducts } from "../services/productApi";
import Reveal from "../components/common/Reveal";

const PRODUCTS_PER_PAGE = 12;

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search")?.trim() || "";
const category = searchParams.get("category")?.trim() || "";

  const requestedPage = Number(searchParams.get("page"));

  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts(
          page,
          PRODUCTS_PER_PAGE,
          search,category
        );

        if (!active) return;

        setProducts(data.products || []);
        setTotalProducts(data.totalProducts || 0);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.currentPage || page);
      } catch (err) {
        if (!active) return;

        console.error("Failed to fetch products:", err);
        setError("Unable to load products. Please try again.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, [page,category, search]);

  function changePage(newPage) {
    if (
      newPage < 1 ||
      newPage > totalPages ||
      newPage === currentPage
    ) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", String(newPage));

    setSearchParams(nextParams);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  const startProduct =
    totalProducts === 0
      ? 0
      : (currentPage - 1) * PRODUCTS_PER_PAGE + 1;

  const endProduct = Math.min(
    currentPage * PRODUCTS_PER_PAGE,
    totalProducts
  );

  const visiblePages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).filter(
    (number) =>
      number === 1 ||
      number === totalPages ||
      Math.abs(number - currentPage) <= 1
  );

  return (
    <section className="min-h-[65vh] bg-ivory px-5 py-12 sm:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">

        {/* Page Heading */}
        <Reveal>
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-taupe">
              The Collection
            </p>

            <h1 className="font-serif text-4xl text-chocolate sm:text-5xl">
  {category ? `${category} Collection` : "Our Products"}
</h1>

            <div className="mx-auto mt-5 h-px w-16 bg-gold" />

            <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-taupe">
              Explore our collection of beautiful salwar materials,
              thoughtfully selected for every occasion.
            </p>

            {search && (
              <div className="mt-5">
                <p className="text-sm text-taupe">
                  Search results for{" "}
                  <span className="font-medium text-chocolate">
                    "{search}"
                  </span>
                </p>

                <Link
                  to="/products"
                  className="mt-2 inline-block text-xs text-chocolate underline decoration-gold underline-offset-4 hover:text-gold"
                >
                  Clear search
                </Link>
              </div>
            )}
          </div>
        </Reveal>

        {/* Loading */}
        {loading && (
          <p className="py-16 text-center text-sm text-taupe">
            Loading products...
          </p>
        )}

        {/* Error */}
        {!loading && error && (
          <p className="py-16 text-center text-sm text-rose">
            {error}
          </p>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <p className="py-16 text-center text-sm text-taupe">
            {search
              ? `No products found for "${search}".`
              : "No products available at the moment."}
          </p>
        )}

        {/* Products */}
        {!loading && !error && products.length > 0 && (
          <>
            <Reveal>
              {/* Product Count */}
              <div className="mb-6 flex items-center justify-between">
                <p className="text-xs text-taupe sm:text-sm">
                  Showing {startProduct}–{endProduct} of{" "}
                  {totalProducts} products
                </p>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-7">
                {products.map((product) => {
                  const image =
                    product.images?.[0]?.url ||
                    product.images?.[0];

                  const discountedPrice = Number(
                    product.discountPrice
                  );

                  const actualPrice = Number(
                    product.actualPrice
                  );

                  return (
                    <article
                      key={product._id}
                      className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#EAE2D8]/70 bg-offwhite shadow-[0_3px_18px_rgba(74,46,31,0.035)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(74,46,31,0.09)]"
                    >
                      {/* Product Image */}
                      <Link
                        to={`/products/${product._id}`}
                        className="relative block aspect-[3/4] overflow-hidden bg-sand"
                        aria-label={`View ${product.title}`}
                      >
                        {image ? (
                          <img
                            src={image}
                            alt={product.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center px-2 text-center text-xs text-taupe">
                            Image coming soon
                          </div>
                        )}

                        {/* Sold Out Badge */}
                        {product.stock === 0 && (
                          <span className="absolute left-2 top-2 rounded-full bg-offwhite/95 px-2.5 py-1 text-[9px] font-medium text-chocolate sm:left-3 sm:top-3 sm:text-[10px]">
                            Sold Out
                          </span>
                        )}
                      </Link>

                      {/* Product Information */}
                      <div className="flex flex-1 flex-col p-3 sm:p-4">

                        {/* Material */}
                        <p className="mb-1 truncate text-[10px] uppercase tracking-[0.12em] text-taupe sm:text-xs">
                          {product.materialType || product.category}
                        </p>

                        {/* Product Title */}
                        <Link to={`/products/${product._id}`}>
                          <h2 className="line-clamp-2 min-h-10 text-[13px] font-medium leading-5 text-chocolate sm:text-base sm:leading-6">
                            {product.title}
                          </h2>
                        </Link>

                        {/* Prices */}
                        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="text-sm font-semibold text-chocolate sm:text-base">
                            ₹{discountedPrice.toLocaleString("en-IN")}
                          </span>

                          {actualPrice > discountedPrice && (
                            <span className="text-[11px] text-taupe line-through sm:text-xs">
                              ₹{actualPrice.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>

                        {/* View Details */}
                        <Link
                          to={`/products/${product._id}`}
                          className="mt-4 flex min-h-9 w-full items-center justify-center rounded-lg border border-gold/50 bg-[#F7F0E5] px-2 py-2 text-[11px] font-medium text-chocolate transition-colors duration-200 hover:border-gold hover:bg-gold hover:text-white sm:min-h-10 sm:text-sm"
                        >
                          View Details
                        </Link>

                      </div>
                    </article>
                  );
                })}
              </div>
            </Reveal>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-14 flex flex-col items-center gap-5">
                <div className="flex items-center gap-2">

                  {/* Previous */}
                  <button
                    type="button"
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#EAE2D8] bg-offwhite text-chocolate transition-colors hover:border-gold hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {/* Page Numbers */}
                  {visiblePages.map((number, index) => (
                    <div
                      key={number}
                      className="flex items-center gap-2"
                    >
                      {index > 0 &&
                        number - visiblePages[index - 1] > 1 && (
                          <span className="px-1 text-taupe">
                            …
                          </span>
                        )}

                      <button
                        type="button"
                        onClick={() => changePage(number)}
                        aria-label={`Page ${number}`}
                        aria-current={
                          currentPage === number
                            ? "page"
                            : undefined
                        }
                        className={`flex h-10 min-w-10 items-center justify-center rounded-lg border px-2 text-sm transition-colors ${
                          currentPage === number
                            ? "border-chocolate bg-chocolate text-white"
                            : "border-[#EAE2D8] bg-offwhite text-chocolate hover:border-gold hover:bg-gold/10"
                        }`}
                      >
                        {number}
                      </button>
                    </div>
                  ))}

                  {/* Next */}
                  <button
                    type="button"
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#EAE2D8] bg-offwhite text-chocolate transition-colors hover:border-gold hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <ChevronRight size={18} />
                  </button>

                </div>

                <p className="text-xs text-taupe">
                  Page {currentPage} of {totalPages}
                </p>
              </div>
            )}
          </>
        )}

      </div>
    </section>
  );
}

export default Products;



