import { Mail, Phone, ArrowUpRight } from "lucide-react";
import { FaInstagram } from "react-icons/fa6";

const paymentMethods = [
  {
    name: "Google Pay",
    image: "https://api.mysto.shop/storage/bundled-apps/trust-badges/icons/gpay.png",
  },
  {
    name: "UPI",
    image: "https://api.mysto.shop/storage/bundled-apps/trust-badges/icons/upi.png",
  },
  {
    name: "PhonePe",
    image: "https://api.mysto.shop/storage/bundled-apps/trust-badges/icons/phonepe.png",
  },
  {
    name: "Visa",
    image: "https://api.mysto.shop/storage/bundled-apps/trust-badges/icons/visa.png",
  },
  {
    name: "Mastercard",
    image: "https://api.mysto.shop/storage/bundled-apps/trust-badges/icons/mastercard.png",
  },
];

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Shop All", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Contact", href: "/contact" },
];

function Footer() {
  return (
    <footer className="border-t border-gold/20 bg-[#F8F5EF] text-chocolate">

      {/* Main footer */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-9 px-5 py-12 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:gap-12 lg:py-14">

        {/* Brand */}
        <div>
          <a
            href="/"
            className="inline-block font-serif text-2xl tracking-tight text-chocolate"
          >
            Threads & Tassels
          </a>

          <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-taupe">
            Salwar Materials & Fabrics
          </p>

          <div className="mt-5 h-[2px] w-10 bg-sage" />

          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-taupe">
            Follow Us
          </p>

          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="mt-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold/25 bg-offwhite text-chocolate transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:text-gold"
          >
            <FaInstagram size={17} />
          </a>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">
            Quick Links
          </h3>

          <nav className="flex flex-col items-start gap-3">
            {quickLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-chocolate/85 transition-colors duration-300 hover:text-gold"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">
            Contact Info
          </h3>

          <div className="space-y-4">
            <a
              href="mailto:contact@example.com"
              className="flex items-center gap-3 text-sm text-chocolate/85 transition-colors hover:text-gold"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-offwhite text-sage">
                <Mail size={16} strokeWidth={1.6} />
              </span>

              <span className="break-all">
                contact@example.com
              </span>
            </a>

            <a
              href="tel:+9197356854339"
              className="flex items-center gap-3 text-sm text-chocolate/85 transition-colors hover:text-gold"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-offwhite text-sage">
                <Phone size={16} strokeWidth={1.6} />
              </span>

              <span>+91 73568 54339</span>
            </a>
          </div>
        </div>

        {/* Brand note */}
        <div className="lg:pl-4">
          <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">
            Threads & Tassels
          </h3>

          <p className="max-w-xs font-serif text-lg leading-relaxed text-chocolate/80">
            Timeless fabrics for your beautiful moments.
          </p>

          <div className="mt-5 flex items-center gap-2 text-xs text-gold">
            Explore Our Collection
            <ArrowUpRight size={15} />
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="border-t border-gold/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 py-7 text-center">

          <p className="text-[11px] text-taupe">
            © 2026 ID-1956294551. All rights reserved.
          </p>

          {/* Payment icons */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {paymentMethods.map((method) => (
              <div
                key={method.name}
                className="flex h-8 w-[54px] items-center justify-center rounded-md border border-gold/10 bg-white px-2"
              >
                <img
                  src={method.image}
                  alt={method.name}
                  loading="lazy"
                  className="max-h-5 max-w-full object-contain"
                />
              </div>
            ))}
          </div>

          {/* Policies */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
            <a
              href="/terms"
              className="text-[10px] uppercase tracking-wider text-taupe transition-colors hover:text-gold"
            >
              Terms & Conditions
            </a>

            <a
              href="/privacy-policy"
              className="text-[10px] uppercase tracking-wider text-taupe transition-colors hover:text-gold"
            >
              Privacy Policy
            </a>

            <a
              href="/shipping-policy"
              className="text-[10px] uppercase tracking-wider text-taupe transition-colors hover:text-gold"
            >
              Shipping Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
