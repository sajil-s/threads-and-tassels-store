
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import { getProductById } from "../services/productApi";
import { addToCart } from "../services/cartApi";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/common/Toast";


function formatPrice(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [cartError, setCartError] = useState("");

  const touchStartX = useRef(null);

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");
        setProduct(null);
        setQuantity(1);
        setActiveImage(0);
        setDescriptionExpanded(false);
        setCartMessage("");
        setCartError("");

        const data = await getProductById(id);

        if (active) {
          setProduct(data.product);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              "Unable to load this product."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProduct();

    return () => {
      active = false;
    };
  }, [id]);

  const images = (product?.images || [])
    .map((image) =>
      typeof image === "string" ? image : image?.url
    )
    .filter(Boolean);

  const stock = Number(product?.stock || 0);
  const outOfStock = stock <= 0;
  const lowStock = stock > 0 && stock < 3;

  const sellingPrice = Number(product?.discountPrice || 0);
  const actualPrice = Number(product?.actualPrice || 0);

  const description = product?.description || "";
  const DESCRIPTION_LIMIT = 180;
  const hasLongDescription =
    description.length > DESCRIPTION_LIMIT;

  const visibleDescription =
    descriptionExpanded || !hasLongDescription
      ? description
      : `${description.slice(0, DESCRIPTION_LIMIT).trimEnd()}...`;

  function previousImage() {
    if (images.length < 2) return;

    setActiveImage((current) =>
      current === 0 ? images.length - 1 : current - 1
    );
  }

  function nextImage() {
    if (images.length < 2) return;

    setActiveImage((current) =>
      (current + 1) % images.length
    );
  }

  function handleTouchStart(event) {
    touchStartX.current = event.touches[0].clientX;
  }

  function handleTouchEnd(event) {
    if (touchStartX.current === null) return;

    const difference =
      touchStartX.current - event.changedTouches[0].clientX;

    if (Math.abs(difference) > 45) {
      if (difference > 0) nextImage();
      else previousImage();
    }

    touchStartX.current = null;
  }

  function increaseQuantity() {
    setQuantity((current) => Math.min(current + 1, stock));
  }

  function decreaseQuantity() {
    setQuantity((current) => Math.max(current - 1, 1));
  }

  function requireLogin(destination) {
    navigate("/login", {
      state: { from: destination },
    });
  }

  async function handleAddToCart() {
    if (outOfStock || addingToCart || authLoading) return;

    if (!isAuthenticated) {
      requireLogin(`/products/${id}`);
      return;
    }

    try {
      setAddingToCart(true);
      setCartMessage("");
      setCartError("");

      await addToCart(id, quantity);

      setCartMessage("Product added to your cart.");
    } catch (err) {
      setCartError(
        err.response?.data?.message ||
          "Could not add product to cart."
      );
    } finally {
      setAddingToCart(false);
    }
  }

  function handleBuyNow() {
    if (outOfStock || authLoading) return;

    // The checkout page will read this state and collect
    // the shipping address before calling the backend.
    const checkoutState = {
      checkoutType: "buyNow",
      productId: id,
      quantity,
    };

    if (!isAuthenticated) {
      // Persist the selection only until the user completes login.
      sessionStorage.setItem(
        "threadsTasselsPendingCheckout",
        JSON.stringify(checkoutState)
      );

      requireLogin("/checkout");
      return;
    }

    navigate("/checkout", {
      state: checkoutState,
    });
  }

  if (loading) {
    return (
      <section className="min-h-[70vh] bg-ivory px-5 py-20">
        <p className="text-center text-sm text-taupe">
          Loading product details...
        </p>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="min-h-[70vh] bg-ivory px-5 py-20 text-center">
        <p role="alert" className="text-sm text-red-600">
          {error || "Product not found."}
        </p>

        <Link
          to="/products"
          className="mt-6 inline-block text-sm text-chocolate underline"
        >
          Back to Products
        </Link>
      </section>
    );
  }

  return (
    <section className="min-h-[75vh] bg-ivory px-3 py-6 sm:px-8 sm:py-12 lg:py-16">
      <Toast
  message={cartMessage || cartError}
  type={cartError ? "error" : "success"}
  onClose={() => {
    setCartMessage("");
    setCartError("");
  }}
/>
      
      <div className="mx-auto max-w-6xl">

        {/* <Link
          to="/products"
          className="mb-6 inline-flex items-center gap-2 px-2 text-xs text-taupe transition-colors hover:text-chocolate sm:text-sm"
        >
          <ArrowLeft size={16} />
          Back to Products
        </Link> */}

        <div className="overflow-hidden rounded-2xl border border-[#EAE2D8] bg-offwhite shadow-[0_8px_40px_rgba(74,46,31,0.05)] sm:rounded-3xl">

          <div className="grid lg:grid-cols-2">

            {/* PRODUCT IMAGES */}
            <div className="min-w-0 bg-[#F5F0E9] p-3 sm:p-6 lg:p-8">
              <div
                className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#EAE2D8] sm:rounded-2xl"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {images.length > 0 ? (
                  <img
                    key={images[activeImage]}
                    src={images[activeImage]}
                    alt={`${product.title} - image ${activeImage + 1}`}
                    className="h-full w-full select-none object-cover"
                    draggable={false}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-taupe">
                    Image coming soon
                  </div>
                )}

                {outOfStock && (
                  <span className="absolute left-3 top-3 rounded-full bg-offwhite px-3 py-1.5 text-xs font-medium text-chocolate">
                    Sold Out
                  </span>
                )}

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={previousImage}
                      aria-label="Previous product image"
                      className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-offwhite/90 text-chocolate shadow-sm transition-colors hover:bg-white"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <button
                      type="button"
                      onClick={nextImage}
                      aria-label="Next product image"
                      className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-offwhite/90 text-chocolate shadow-sm transition-colors hover:bg-white"
                    >
                      <ChevronRight size={20} />
                    </button>

                    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-black/20 px-3 py-2 backdrop-blur-sm">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setActiveImage(index)}
                          aria-label={`Show image ${index + 1}`}
                          className={`h-1.5 rounded-full transition-all ${
                            activeImage === index
                              ? "w-5 bg-white"
                              : "w-1.5 bg-white/60"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* IMAGE THUMBNAILS */}
              {images.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                  {images.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      aria-label={`Select product image ${index + 1}`}
                      className={`h-17 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-colors sm:h-20 sm:w-16 ${
                        activeImage === index
                          ? "border-gold"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={image}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* PRODUCT INFORMATION */}
            <div className="min-w-0 p-5 sm:p-8 lg:p-10">

              <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-taupe">
                {product.category || "Our Collection"}
              </p>

              <h1 className="font-serif text-2xl leading-snug text-chocolate sm:text-3xl lg:text-4xl">
                {product.title}
              </h1>

              {/* PRICES */}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="text-2xl font-semibold text-chocolate sm:text-3xl">
                  {formatPrice(sellingPrice)}
                </span>

                {actualPrice > sellingPrice && (
                  <span className="text-base text-taupe line-through sm:text-lg">
                    {formatPrice(actualPrice)}
                  </span>
                )}
              </div>

              {Number(product.offerPercentage) > 0 && (
                <p className="mt-2 text-xs font-medium text-[#8FA580]">
                  Additional {product.offerPercentage}% offer applied
                </p>
              )}

              <div className="my-6 h-px bg-[#EAE2D8]" />

              {/* MATERIAL AND COLOUR */}
              <div className="grid grid-cols-2 gap-5 text-sm">
                <div>
                  <p className="mb-2 text-xs text-taupe">
                    Material Type
                  </p>

                  <p className="font-medium text-chocolate">
                    {product.materialType || "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs text-taupe">
                    Colour
                  </p>

                  <p className="font-medium text-chocolate">
                    {product.color || "Not specified"}
                  </p>
                </div>
              </div>

              {/* STOCK */}
              <div className="mt-7">
                {outOfStock ? (
                  <div className="flex items-center gap-2 text-sm font-medium text-red-600">
                    <AlertTriangle size={17} />
                    Out of Stock
                  </div>
                ) : lowStock ? (
                  <div className="flex items-center gap-2 text-sm font-medium text-red-400">
                    <AlertTriangle size={17} />
                    Low Stock — Only {stock} Left!
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm font-medium text-[#638459]">
                    <CheckCircle2 size={17} />
                    In Stock
                  </div>
                )}
              </div>

              {/* QUANTITY */}
              <div className="mt-7">
                <p className="mb-3 text-sm font-medium text-chocolate">
                  Quantity
                </p>

                <div className="inline-flex h-11 items-center overflow-hidden rounded-xl border border-[#EAE2D8] bg-ivory">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={outOfStock || quantity <= 1}
                    aria-label="Decrease quantity"
                    className="flex h-full w-11 items-center justify-center text-chocolate hover:bg-[#EAE2D8] disabled:opacity-30"
                  >
                    <Minus size={17} />
                  </button>

                  <span className="min-w-12 text-center text-sm font-semibold text-chocolate">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={outOfStock || quantity >= stock}
                    aria-label="Increase quantity"
                    className="flex h-full w-11 items-center justify-center text-chocolate hover:bg-[#EAE2D8] disabled:opacity-30"
                  >
                    <Plus size={17} />
                  </button>
                </div>
              </div>

              {/* PAYMENT METHODS */}
              <div className="mt-7 rounded-xl border border-[#EAE2D8] bg-ivory px-4 py-3">
                <p className="mb-2 text-[11px] text-taupe">
                  Secure payments supported
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-chocolate">
                  <span>UPI</span>
                  <span className="text-[#C9A46A]">•</span>
                  <span>Visa</span>
                  <span className="text-[#C9A46A]">•</span>
                  <span>Mastercard</span>
                  <span className="text-[#C9A46A]">•</span>
                  <span>RuPay</span>
                </div>
              </div>

              {/* BUY BUTTONS */}
              <div className="mt-7 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={outOfStock || authLoading}
                  className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-chocolate px-3 text-xs font-semibold text-white transition-colors hover:bg-[#674631] disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
                >
                  <ShoppingBag size={17} />
                  Buy Now
                </button>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={outOfStock || addingToCart || authLoading}
                  className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#8FA580] px-3 text-xs font-semibold text-white transition-colors hover:bg-[#748B67] disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
                >
                  <ShoppingCart size={17} />
                  {addingToCart ? "Adding..." : "Add to Cart"}
                </button>
              </div>

              {/* {cartMessage && (
                <p role="status" className="mt-4 text-sm text-green-700">
                  {cartMessage}{" "}
                  <Link
                    to="/cart"
                    className="font-medium underline underline-offset-4"
                  >
                    View Cart
                  </Link>
                </p>
              )}

              {cartError && (
                <p role="alert" className="mt-4 text-sm text-red-600">
                  {cartError}
                </p>
              )} */}

              {/* DESCRIPTION - AFTER BUTTONS */}
              <div className="mt-8 border-t border-[#EAE2D8] pt-7">
                <h2 className="font-serif text-xl text-chocolate sm:text-2xl">
                  Product Description
                </h2>

                <p className="mt-4 whitespace-pre-line break-words text-sm leading-7 text-taupe">
                  {visibleDescription || "No description available."}
                </p>

                {hasLongDescription && (
                  <button
                    type="button"
                    onClick={() =>
                      setDescriptionExpanded((current) => !current)
                    }
                    aria-expanded={descriptionExpanded}
                    className="mt-3 text-sm font-semibold text-chocolate underline decoration-gold underline-offset-4 hover:text-gold"
                  >
                    {descriptionExpanded ? "Read Less" : "Read More"}
                  </button>
                )}
              </div>

              {/* EXTRA DETAILS */}
              {(product.design ||
                product.care ||
                product.lengths) && (
                <div className="mt-7 border-t border-[#EAE2D8] pt-6">
                  <h2 className="font-serif text-lg text-chocolate">
                    Additional Details
                  </h2>

                  <div className="mt-4 space-y-3 text-sm">
                    {product.design && (
                      <p>
                        <span className="text-taupe">Design: </span>
                        <span className="text-chocolate">
                          {product.design}
                        </span>
                      </p>
                    )}

                    {product.care && (
                      <p>
                        <span className="text-taupe">Care: </span>
                        <span className="text-chocolate">
                          {product.care}
                        </span>
                      </p>
                    )}

                    {product.lengths &&
                      typeof product.lengths === "object" && (
                        <div className="space-y-2">
                          {Object.entries(product.lengths).map(
                            ([name, value]) =>
                              value != null &&
                              value !== "" && (
                                <p key={name}>
                                  <span className="capitalize text-taupe">
                                    {name}:{" "}
                                  </span>
                                  <span className="text-chocolate">
                                    {String(value)}
                                  </span>
                                </p>
                              )
                          )}
                        </div>
                      )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;
