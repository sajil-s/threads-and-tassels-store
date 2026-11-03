
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  LockKeyhole,
  MapPin,
  MessageCircle,
  Package,
  ShieldCheck,
} from "lucide-react";

import { getCart } from "../services/cartApi";
import { getProductById } from "../services/productApi";
import {
  createCheckout,
  verifyCheckoutPayment,
} from "../services/checkoutApi";

const WHATSAPP_NUMBER = "917356854339";
const PENDING_CHECKOUT_KEY = "threadsTasselsPendingCheckout";

const formatPrice = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

function isIndianCountry(value) {
  const normalized = value.toLowerCase().replace(/[.\s]/g, "");
  return normalized === "india" || normalized === "bharat";
}

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    const existing = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Could not load payment gateway.")),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Could not load payment gateway."));
    document.body.appendChild(script);
  });
}

const inputClass =
  "mt-2 w-full rounded-xl border border-[#EAE2D8] bg-[#FAF7F1] px-4 py-3 text-sm text-[#4A2E1F] outline-none transition-colors placeholder:text-[#A7A7A5] focus:border-[#C9A46A]";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [checkoutSelection, setCheckoutSelection] = useState(null);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [paymentPending, setPaymentPending] = useState(false);

  const processingRef = useRef(false);
  const paymentRef = useRef(null);

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  const isIndia = isIndianCountry(address.country);
  const whatsappUrl =
    `https://wa.me/${WHATSAPP_NUMBER}?text=` +
    encodeURIComponent(
      "Hello, I would like to place an international order for Threads & Tassels."
    );

  useEffect(() => {
    let active = true;

    async function initializeCheckout() {
      try {
        setLoading(true);
        setError("");

        let selection = location.state;

        if (!selection?.checkoutType) {
          const saved = sessionStorage.getItem(PENDING_CHECKOUT_KEY);

          if (saved) {
            try {
              selection = JSON.parse(saved);
            } catch {
              sessionStorage.removeItem(PENDING_CHECKOUT_KEY);
            }
          }
        }

        if (
          selection?.checkoutType === "buyNow" &&
          typeof selection.productId === "string" &&
          Number.isInteger(selection.quantity) &&
          selection.quantity > 0
        ) {
          const data = await getProductById(selection.productId);
          const product = data.product;

          if (!product || product.stock < selection.quantity) {
            throw new Error(
              "The selected quantity is no longer available."
            );
          }

          if (!active) return;

          const price = Number(product.discountPrice);

          setCheckoutSelection({
            checkoutType: "buyNow",
            productId: selection.productId,
            quantity: selection.quantity,
          });

          setItems([
            {
              product,
              quantity: selection.quantity,
              price,
              subtotal: price * selection.quantity,
            },
          ]);

          setTotal(price * selection.quantity);
        } else {
          const data = await getCart();

          if (!active) return;

          const cartItems = data.items || [];

          if (!cartItems.length) {
            throw new Error("Your cart is empty.");
          }

          setCheckoutSelection({ checkoutType: "cart" });
          setItems(cartItems);
          setTotal(Number(data.total || 0));
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Unable to prepare checkout."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    initializeCheckout();

    return () => {
      active = false;
    };
  }, [location.state]);

  function handleAddressChange(event) {
    const { name, value } = event.target;

    setAddress((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  const validateAddress = useCallback(() => {
    const required = [
      "fullName",
      "phone",
      "addressLine",
      "city",
      "state",
      "postalCode",
      "country",
    ];

    if (required.some((field) => !address[field].trim())) {
      return "Please complete all shipping address fields.";
    }

    if (!isIndia) {
      return "International shipping is available only through WhatsApp.";
    }

    if (!/^[6-9]\d{9}$/.test(address.phone.trim())) {
      return "Enter a valid 10-digit Indian mobile number.";
    }

    if (!/^\d{6}$/.test(address.postalCode.trim())) {
      return "Enter a valid 6-digit Indian PIN code.";
    }

    return "";
  }, [address, isIndia]);

  async function handlePayment(event) {
    event.preventDefault();

    if (processingRef.current || paymentPending) return;

    setPaymentError("");

    const validationError = validateAddress();

    if (validationError) {
      setPaymentError(validationError);
      return;
    }

    if (!checkoutSelection || !items.length) return;

    if (
      items.some(
        (item) =>
          !item.product ||
          Number(item.product.stock) < item.quantity
      )
    ) {
      setPaymentError(
        "Some items are no longer available in the requested quantity."
      );
      return;
    }

    processingRef.current = true;
    setProcessing(true);

    let orderCreated = false;

    try {
      // Load Razorpay before reserving stock.
      await loadRazorpayScript();

      const shippingAddress = Object.fromEntries(
        Object.entries(address).map(([key, value]) => [
          key,
          value.trim(),
        ])
      );

      const payload = {
        checkoutType: checkoutSelection.checkoutType,
        shippingAddress,
      };

      if (checkoutSelection.checkoutType === "buyNow") {
        payload.productId = checkoutSelection.productId;
        payload.quantity = checkoutSelection.quantity;
      }

      const data = await createCheckout(payload);
      orderCreated = true;

      const order = data.order;

      if (!order?.razorpayOrderId || !data.razorpayKeyId) {
        throw new Error("Invalid payment gateway response.");
      }

      // Keep the payment flow locked after an order is created.
      setPaymentPending(true);

      const options = {
        key: data.razorpayKeyId,
        amount: order.razorpayAmount,
        currency: order.currency || "INR",
        name: "Threads & Tassels",
        description: "Boutique Order",
        order_id: order.razorpayOrderId,

        prefill: {
          name: shippingAddress.fullName,
          contact: shippingAddress.phone,
        },

        theme: {
          color: "#4A2E1F",
        },

        modal: {
          ondismiss: () => {
            setProcessing(false);
            setPaymentError(
              "Payment window closed. Your pending order may still have reserved stock. Please wait for the reservation to expire before trying again."
            );
          },
        },

        handler: async function (response) {
          try {
            setProcessing(true);
            setPaymentError("");

            const verified = await verifyCheckoutPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (!verified.success) {
              throw new Error("Payment verification failed.");
            }

            sessionStorage.removeItem(PENDING_CHECKOUT_KEY);

            navigate(`/account/orders/${verified.orderId}`, {
              replace: true,
              state: { paymentSuccess: true },
            });
          } catch (err) {
            setPaymentError(
              err.response?.data?.message ||
                "Payment could not be verified. Do not pay again until you check your order status."
            );
          } finally {
            setProcessing(false);
          }
        },
      };

      const razorpay = new window.Razorpay(options);
      paymentRef.current = razorpay;

      razorpay.on("payment.failed", () => {
        setPaymentError(
          "Payment failed. Check your order status before attempting another payment."
        );
        setProcessing(false);
      });

      razorpay.open();
    } catch (err) {
      setPaymentError(
        err.response?.data?.message ||
          err.message ||
          "Could not start checkout."
      );

      if (orderCreated) {
        setPaymentPending(true);
      }
    } finally {
      processingRef.current = false;
      setProcessing(false);
    }
  }

  if (loading) {
    return (
      <section className="min-h-[70vh] bg-[#FAF7F1] px-5 py-20">
        <p className="text-center text-sm text-[#A7A7A5]">
          Preparing your checkout...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-[70vh] bg-[#FAF7F1] px-5 py-20 text-center">
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>

        <Link
          to="/products"
          className="mt-5 inline-block text-sm text-[#4A2E1F] underline"
        >
          Continue Shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#FAF7F1] px-4 py-10 sm:px-8 lg:py-16">
      <div className="mx-auto max-w-6xl">

        <Link
          to={checkoutSelection?.checkoutType === "cart"
            ? "/cart"
            : "/products"}
          className="mb-6 inline-flex items-center gap-2 text-sm text-[#8A786D] hover:text-[#4A2E1F]"
        >
          <ArrowLeft size={16} />
          Back to Shopping
        </Link>

        <div className="mb-10 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#C9A46A]">
            Threads & Tassels
          </p>

          <h1 className="font-serif text-4xl text-[#4A2E1F] sm:text-5xl">
            Secure Checkout
          </h1>

          <div className="mx-auto mt-5 h-px w-16 bg-[#C9A46A]" />

          <p className="mt-4 text-sm text-[#8A786D]">
            Complete your order in a few simple steps.
          </p>
        </div>

        <form
          onSubmit={handlePayment}
          className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_370px]"
        >
          {/* SHIPPING CARD */}
          <div className="rounded-2xl border border-[#EAE2D8] bg-[#FFFCF8] p-5 shadow-[0_6px_30px_rgba(74,46,31,0.04)] sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FAF7F1] text-[#C9A46A]">
                <MapPin size={21} />
              </div>

              <div>
                <h2 className="font-serif text-2xl text-[#4A2E1F]">
                  Shipping Address
                </h2>
                <p className="mt-1 text-xs text-[#8A786D]">
                  Delivery within India only
                </p>
              </div>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium text-[#4A2E1F]">
                Full Name
                <input
                  name="fullName"
                  value={address.fullName}
                  onChange={handleAddressChange}
                  placeholder="Your full name"
                  autoComplete="name"
                  className={inputClass}
                  required
                />
              </label>

              <label className="block text-sm font-medium text-[#4A2E1F]">
                Phone Number
                <input
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  value={address.phone}
                  onChange={handleAddressChange}
                  placeholder="10-digit mobile number"
                  autoComplete="tel"
                  className={inputClass}
                  required
                />
              </label>

              <label className="block text-sm font-medium text-[#4A2E1F] sm:col-span-2">
                Full Address
                <textarea
                  name="addressLine"
                  value={address.addressLine}
                  onChange={handleAddressChange}
                  placeholder="House name, street, locality, landmark..."
                  autoComplete="street-address"
                  rows={3}
                  className={inputClass}
                  required
                />
              </label>

              <label className="block text-sm font-medium text-[#4A2E1F]">
                City
                <input
                  name="city"
                  value={address.city}
                  onChange={handleAddressChange}
                  placeholder="City"
                  autoComplete="address-level2"
                  className={inputClass}
                  required
                />
              </label>

              <label className="block text-sm font-medium text-[#4A2E1F]">
                State
                <input
                  name="state"
                  value={address.state}
                  onChange={handleAddressChange}
                  placeholder="State"
                  autoComplete="address-level1"
                  className={inputClass}
                  required
                />
              </label>

              <label className="block text-sm font-medium text-[#4A2E1F]">
                PIN Code
                <input
                  name="postalCode"
                  inputMode="numeric"
                  value={address.postalCode}
                  onChange={handleAddressChange}
                  placeholder="6-digit PIN code"
                  autoComplete="postal-code"
                  className={inputClass}
                  required
                />
              </label>

              <label className="block text-sm font-medium text-[#4A2E1F]">
                Country
                <input
                  name="country"
                  value={address.country}
                  onChange={handleAddressChange}
                  placeholder="Country"
                  autoComplete="country-name"
                  className={inputClass}
                  required
                />
              </label>
            </div>

            {/* INTERNATIONAL SHIPPING WARNING */}
            {!isIndia && (
              <div
                role="alert"
                className="mt-7 rounded-xl border border-[#E9A09A]/50 bg-[#FFF1EF] p-4"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle
                    size={20}
                    className="mt-0.5 shrink-0 text-red-600"
                  />

                  <div>
                    <p className="text-sm font-semibold text-[#4A2E1F]">
                      International Shipping
                    </p>

                    <p className="mt-2 text-xs leading-6 text-[#8A786D]">
                      International shipping is available only through
                      WhatsApp. Website checkout accepts Indian
                      shipping addresses only.
                    </p>
                  </div>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#287D52] px-5 py-3 text-sm font-medium text-white hover:bg-[#206A45]"
                >
                  <MessageCircle size={18} />
                  Order via WhatsApp
                </a>
              </div>
            )}

            <div className="mt-7 flex items-start gap-2 rounded-xl bg-[#F1F4ED] px-4 py-3">
              <ShieldCheck
                size={18}
                className="mt-0.5 shrink-0 text-[#638459]"
              />
              <p className="text-xs leading-6 text-[#638459]">
                Your shipping details are used to deliver your order.
                Payment is processed securely through Razorpay.
              </p>
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <aside className="rounded-2xl border border-[#EAE2D8] bg-[#FFFCF8] p-5 shadow-[0_6px_30px_rgba(74,46,31,0.04)] sm:p-6 lg:sticky lg:top-28">
            <div className="flex items-center gap-3">
              <Package size={21} className="text-[#C9A46A]" />
              <h2 className="font-serif text-2xl text-[#4A2E1F]">
                Order Summary
              </h2>
            </div>

            <div className="mt-6 space-y-5">
              {items.map((item) => {
                const product = item.product;
                const image =
                  product?.images?.[0]?.url ||
                  product?.images?.[0];

                return (
                  <div
                    key={product?._id}
                    className="flex items-start gap-3"
                  >
                    <div className="h-22 w-17 shrink-0 overflow-hidden rounded-lg bg-[#FAF7F1]">
                      {image ? (
                        <img
                          src={image}
                          alt={product.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-[#A7A7A5]">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-medium text-[#4A2E1F]">
                        {product?.title}
                      </p>

                      <p className="mt-1 text-xs text-[#8A786D]">
                        Qty: {item.quantity}
                      </p>

                      <p className="mt-2 text-sm font-semibold text-[#4A2E1F]">
                        {formatPrice(item.subtotal)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="my-6 h-px bg-[#EAE2D8]" />

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-[#8A786D]">Subtotal</span>
                <span className="text-[#4A2E1F]">
                  {formatPrice(total)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-[#8A786D]">Shipping</span>
                <span className="text-[#8A786D]">
                  No separate fee in current checkout
                </span>
              </div>
            </div>

            <div className="my-6 h-px bg-[#EAE2D8]" />

            <div className="flex items-center justify-between">
              <span className="font-medium text-[#4A2E1F]">
                Estimated Total
              </span>

              <span className="text-2xl font-semibold text-[#4A2E1F]">
                {formatPrice(total)}
              </span>
            </div>

            <p className="mt-2 text-xs leading-5 text-[#8A786D]">
              Final amount is recalculated by our server before payment.
            </p>

            {paymentError && (
              <div
                role="alert"
                className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs leading-6 text-red-700"
              >
                {paymentError}
              </div>
            )}

            {paymentPending && (
              <div className="mt-4 rounded-xl border border-[#EAE2D8] bg-[#FAF7F1] p-3 text-xs leading-6 text-[#4A2E1F]">
                A payment order has already been created.
                Check your order status before attempting payment again.
              </div>
            )}

            <button
              type="submit"
              disabled={
                !isIndia ||
                processing ||
                paymentPending ||
                !checkoutSelection
              }
              className="mt-7 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#4A2E1F] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#674631] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {processing ? (
                "Processing..."
              ) : (
                <>
                  <CreditCard size={18} />
                  Proceed to Payment
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-[#8A786D]">
              <LockKeyhole size={15} className="text-[#8FA580]" />
              Secure payment via Razorpay
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#638459]">
              <CheckCircle2 size={15} />
              India-only website checkout
            </div>
          </aside>
        </form>
      </div>
    </section>
  );
}

export default Checkout;
