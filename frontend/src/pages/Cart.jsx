
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";

import {
  getCart,
  updateCartQuantity,
  removeCartItem,
} from "../services/cartApi";

const formatPrice = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

function Cart() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [busyProductId, setBusyProductId] = useState(null);

  const loadCart = useCallback(async () => {
    const data = await getCart();
    setItems(data.items || []);
    setTotal(Number(data.total || 0));
  }, []);

  useEffect(() => {
    let active = true;

    async function fetchCart() {
      try {
        setLoading(true);
        setError("");

        const data = await getCart();

        if (!active) return;

        setItems(data.items || []);
        setTotal(Number(data.total || 0));
      } catch (err) {
        if (!active) return;

        setError(
          err.response?.data?.message ||
            "Unable to load your cart."
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchCart();

    return () => {
      active = false;
    };
  }, []);

  async function handleQuantityChange(productId, quantity) {
    if (busyProductId) return;

    try {
      setBusyProductId(productId);
      setActionError("");

      await updateCartQuantity(productId, quantity);
      await loadCart();
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          "Could not update quantity."
      );

      try {
        await loadCart();
      } catch {
        // Keep the existing cart visible.
      }
    } finally {
      setBusyProductId(null);
    }
  }

  async function handleRemove(productId) {
    if (busyProductId) return;

    try {
      setBusyProductId(productId);
      setActionError("");

      await removeCartItem(productId);
      await loadCart();
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          "Could not remove this product."
      );
    } finally {
      setBusyProductId(null);
    }
  }

  const totalItems = items.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  const hasStockIssues = items.some(
    (item) =>
      Number(item.product?.stock || 0) < item.quantity
  );

  const isUpdating = busyProductId !== null;

  function handleCheckout() {
    if (loading || isUpdating || hasStockIssues || !items.length) {
      return;
    }

    navigate("/checkout", {
      state: { checkoutType: "cart" },
    });
  }

  if (loading) {
    return (
      <section className="min-h-[70vh] bg-ivory px-5 py-20">
        <p className="text-center text-sm text-taupe">
          Loading your cart...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-[70vh] bg-ivory px-5 py-20 text-center">
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-5 rounded-xl bg-chocolate px-6 py-3 text-sm text-white"
        >
          Try Again
        </button>
      </section>
    );
  }

  return (
    <section className="min-h-[75vh] bg-ivory px-4 py-10 sm:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">

        {/* PAGE HEADING */}
        <div className="mb-9 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-taupe">
            Your Selection
          </p>

          <h1 className="font-serif text-4xl text-chocolate sm:text-5xl">
            Shopping Cart
          </h1>

          <div className="mx-auto mt-5 h-px w-16 bg-gold" />

          <p className="mt-4 text-sm text-taupe">
            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        {/* EMPTY CART */}
        {items.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-2xl border border-[#EAE2D8] bg-offwhite px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ivory">
              <ShoppingBag
                size={30}
                strokeWidth={1.5}
                className="text-gold"
              />
            </div>

            <h2 className="mt-6 font-serif text-2xl text-chocolate">
              Your Cart Is Empty
            </h2>

            <p className="mt-3 text-sm leading-7 text-taupe">
              Explore our beautiful collection of salwar materials
              and find something you love.
            </p>

            <Link
              to="/products"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-chocolate px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-gold"
            >
              Explore Products
              <ArrowRight size={17} />
            </Link>
          </div>
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_350px]">

            {/* CART ITEMS */}
            <div className="min-w-0 space-y-4">

              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl text-chocolate sm:text-2xl">
                  Your Items
                </h2>

                {/* <Link
                  to="/products"
                  className="inline-flex items-center gap-1 text-xs text-taupe transition-colors hover:text-chocolate sm:text-sm"
                >
                  <ArrowLeft size={15} />
                  Continue Shopping
                </Link> */}
              </div>

              {actionError && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {actionError}
                </div>
              )}

              {items.map((item) => {
                const product = item.product;
                if (!product) return null;

                const productId = product._id;
                const image =
                  product.images?.[0]?.url ||
                  product.images?.[0];

                const stock = Number(product.stock || 0);
                const quantity = Number(item.quantity || 0);
                const isBusy = busyProductId === productId;
                const isUnavailable = stock < quantity;
                const lowStock = stock > 0 && stock < 3;

                const actualPrice = Number(product.actualPrice || 0);
                const sellingPrice = Number(item.price || 0);

                return (
                  <article
                    key={productId}
                    className="rounded-2xl border border-[#EAE2D8] bg-offwhite p-3 shadow-[0_3px_18px_rgba(74,46,31,0.035)] sm:p-5"
                  >
                    <div className="flex gap-3 sm:gap-5">

                      {/* PRODUCT IMAGE */}
                      <Link
                        to={`/products/${productId}`}
                        className="block w-25 shrink-0 overflow-hidden rounded-xl bg-[#F5F0E9] sm:w-35"
                      >
                        {image ? (
                          <img
                            src={image}
                            alt={product.title}
                            className="aspect-[3/4] h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex aspect-[3/4] items-center justify-center px-2 text-center text-xs text-taupe">
                            No image
                          </div>
                        )}
                      </Link>

                      {/* PRODUCT INFORMATION */}
                      <div className="flex min-w-0 flex-1 flex-col">

                        <p className="mb-1 truncate text-[10px] uppercase tracking-[0.15em] text-taupe sm:text-xs">
                          {product.materialType || product.category}
                        </p>

                        <Link to={`/products/${productId}`}>
                          <h3 className="line-clamp-2 text-sm font-medium leading-5 text-chocolate sm:text-lg sm:leading-7">
                            {product.title}
                          </h3>
                        </Link>

                        {product.color && (
                          <p className="mt-1 text-xs text-taupe">
                            Colour: {product.color}
                          </p>
                        )}

                        {/* PRICES */}
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className="text-base font-semibold text-chocolate sm:text-lg">
                            {formatPrice(sellingPrice)}
                          </span>

                          {actualPrice > sellingPrice && (
                            <span className="text-xs text-taupe line-through">
                              {formatPrice(actualPrice)}
                            </span>
                          )}
                        </div>

                        {/* STOCK */}
                        {isUnavailable ? (
                          <p className="mt-2 flex items-center gap-1 text-xs font-medium text-red-600">
                            <AlertTriangle size={13} />
                            {stock === 0
                              ? "Out of stock"
                              : `Only ${stock} available — reduce quantity`}
                          </p>
                        ) : lowStock ? (
                          <p className="mt-2 flex items-center gap-1 text-xs font-medium text-red-600">
                            <AlertTriangle size={13} />
                            Only {stock} left
                          </p>
                        ) : null}

                        {/* QUANTITY + REMOVE */}
                        <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-4">
                          <div className="flex h-9 items-center overflow-hidden rounded-lg border border-[#EAE2D8] bg-ivory">
                            <button
                              type="button"
                              onClick={() =>
                                handleQuantityChange(productId, quantity - 1)
                              }
                              disabled={isUpdating || quantity <= 1}
                              aria-label={`Decrease quantity of ${product.title}`}
                              className="flex h-full w-9 items-center justify-center text-chocolate hover:bg-[#EAE2D8] disabled:opacity-30"
                            >
                              <Minus size={15} />
                            </button>

                            <span className="min-w-8 text-center text-xs font-medium text-chocolate">
                              {isBusy ? "…" : quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                handleQuantityChange(productId, quantity + 1)
                              }
                              disabled={isUpdating || quantity >= stock}
                              aria-label={`Increase quantity of ${product.title}`}
                              className="flex h-full w-9 items-center justify-center text-chocolate hover:bg-[#EAE2D8] disabled:opacity-30"
                            >
                              <Plus size={15} />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemove(productId)}
                            disabled={isUpdating}
                            aria-label={`Remove ${product.title} from cart`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-taupe transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* LINE TOTAL */}
                    <div className="mt-4 flex items-center justify-between border-t border-[#EAE2D8] pt-3">
                      <span className="text-xs text-taupe">
                        Item subtotal
                      </span>

                      <span className="text-sm font-semibold text-chocolate">
                        {formatPrice(item.subtotal)}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* ORDER SUMMARY */}
            <aside className="rounded-2xl border border-[#EAE2D8] bg-offwhite p-5 shadow-[0_3px_18px_rgba(74,46,31,0.035)] sm:p-6 lg:sticky lg:top-28">
              <h2 className="font-serif text-2xl text-chocolate">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-taupe">
                    Subtotal ({totalItems} items)
                  </span>

                  <span className="font-medium text-chocolate">
                    {formatPrice(total)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-taupe">
                    Shipping
                  </span>

                  <span className="text-taupe">
                    Calculated at checkout
                  </span>
                </div>
              </div>

              <div className="my-6 h-px bg-[#EAE2D8]" />

              <div className="flex items-center justify-between">
                <span className="font-medium text-chocolate">
                  Product Total
                </span>

                <span className="text-xl font-semibold text-chocolate">
                  {formatPrice(total)}
                </span>
              </div>

              <p className="mt-2 text-[11px] leading-5 text-taupe">
                Final pricing and availability are confirmed
                during checkout.
              </p>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={isUpdating || hasStockIssues}
                className="mt-7 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-chocolate px-4 text-sm font-semibold text-white transition-colors hover:bg-[#674631] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Proceed to Checkout
                <ArrowRight size={17} />
              </button>

              {hasStockIssues && (
                <p className="mt-3 text-xs leading-5 text-red-600">
                  Adjust unavailable quantities or remove
                  out-of-stock products before checkout.
                </p>
              )}

              <div className="mt-6 flex items-center justify-center gap-2 border-t border-[#EAE2D8] pt-5 text-xs text-taupe">
                <ShieldCheck size={17} className="text-[#8FA580]" />
                Secure checkout via Razorpay
              </div>

              <p className="mt-3 text-center text-xs text-taupe">
                Website checkout is available for Indian
                shipping addresses only.
              </p>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}

export default Cart;
