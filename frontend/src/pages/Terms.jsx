import { Link } from "react-router-dom";
import { ArrowUpRight, FileText, Mail, MapPin, ShieldCheck } from "lucide-react";

const LAST_UPDATED = "5 November 2026";
const SUPPORT_EMAIL = "threadsandtassels@gmail.com"; // REPLACE with the real support email before publishing.

const sections = [
  {
    title: "Overview",
    paragraphs: [
      "Welcome to Threads & Tassels, an online boutique offering salwar materials and fabrics. These Terms & Conditions explain the rules that apply when you browse our website, create an account or place an order.",
      "By using our website or placing an order, you agree to these Terms and to the policies linked on our website. If you do not agree, please do not place an order. Nothing in these Terms limits rights that cannot legally be excluded under applicable law."
    ]
  },
  {
    title: "Eligibility and acceptable use",
    paragraphs: [
      "You must be legally capable of entering into a purchase contract, or use the website with the involvement of a parent or legal guardian where appropriate.",
      "You agree not to misuse the website, interfere with its security, submit false information, attempt unauthorized access or use it for unlawful purposes."
    ]
  },
  {
    title: "Products and descriptions",
    paragraphs: [
      "We aim to describe fabric materials, colours, lengths, care instructions and other product details accurately. Actual colours may appear slightly different because of screen settings, lighting and photography.",
      "Please review the product description before ordering. Product availability and stock quantities may change, and an item shown online may become unavailable before an order is confirmed."
    ]
  },
  {
    title: "Pricing and offers",
    paragraphs: [
      "Prices are displayed in Indian rupees (INR). Any applicable promotional discount will be shown on the website. Offers may be introduced, changed or withdrawn, subject to applicable law and any conditions stated with the offer.",
      "We may correct genuine listing or pricing errors. If an error affects an order already placed, we will contact you to discuss the available options and any refund due."
    ]
  },
  {
    title: "Accounts and customer information",
    paragraphs: [
      "You are responsible for providing accurate registration, contact and delivery information and for keeping your account credentials secure. Please contact us promptly if you suspect unauthorized access to your account.",
      "We use personal information in accordance with our Privacy Policy."
    ]
  },
  {
    title: "Orders and confirmation",
    paragraphs: [
      "Submitting an order does not guarantee that every item can be fulfilled. Orders are subject to successful payment, stock availability and verification of the delivery details.",
      "If we cannot fulfil a paid order, we will contact you and arrange an appropriate resolution, including a refund where due. We may decline fraudulent or unlawful orders."
    ]
  },
  {
    title: "Payments",
    paragraphs: [
      "Website checkout uses supported online payment methods processed through Razorpay. Cash on delivery is not available. Payment processing may also be subject to the payment provider's terms.",
      "Please do not share card PINs, OTPs or banking passwords with anyone claiming to represent Threads & Tassels. If a payment is debited but the order is not confirmed, contact us with the relevant transaction details so we can investigate."
    ]
  },
  {
    title: "Shipping and delivery",
    paragraphs: [
      "We currently accept website orders for delivery within India, with free shipping. International customers may contact us through WhatsApp to enquire separately; international delivery is not available through website checkout.",
      "Delivery normally takes approximately 3–5 days, but this is an estimate, not a guaranteed deadline. Transit conditions, holidays, non-working days, courier availability, weather and other circumstances may affect delivery. We will assist with reasonable delivery enquiries."
    ]
  },
  {
    title: "Order cancellation",
    paragraphs: [
      "As a general store policy, customer-initiated cancellation is not available once an order has been placed. Please review your cart, address and payment details carefully before confirming an order.",
      "If there is a serious issue with an order, contact us promptly. Any cancellation or remedy required by applicable law remains available."
    ]
  },
  {
    title: "Returns, damaged items and exchanges",
    paragraphs:[
    "At Threads & Tassels, we do not accept returns or exchanges for change of mind, personal preferences, colour differences, or incorrect product selections made by customers.",

    "If you receive a damaged, defective, or incorrect product, please contact us within 24 hours of delivery, wherever possible. Customers are requested to provide their order number, clear photographs of the issue, and an unedited parcel-opening (unboxing) video as supporting evidence.",

    "Once we receive your complaint, our team will review the evidence and assess the issue. If the request is approved, we will arrange or discuss a suitable product exchange, subject to product availability and the circumstances of the case.",

    "Threads & Tassels generally does not provide monetary refunds for completed purchases. Our preferred resolution for eligible product-related complaints is an exchange.",

    "If the original product is unavailable, our team will discuss an appropriate alternative resolution. Any refunds or other remedies required under applicable consumer protection laws will be honoured.",

    "The 24-hour reporting period and requested unboxing video help us investigate complaints but do not remove any rights or remedies available under applicable consumer protection laws."
  ]
  },
  {
    title: "Refunds",
    paragraphs: [
      "Where a refund is approved or legally required, our team will arrange it manually after reviewing the order and payment details. We will explain the applicable refund method and expected timeline when the resolution is confirmed.",
      "Refund processing and the time taken for funds to appear may also depend on the payment provider or bank. We do not promise a fixed refund timeline in these Terms."
    ]
  },
  {
    title: "Customer support and complaints",
    paragraphs: [
      "For order problems, delivery enquiries, damaged items or payment concerns, use the contact information at the end of this page. Please include your order number and a description of the issue when available.",
      "We will review enquiries and work toward a reasonable resolution, taking applicable consumer rights into account."
    ]
  },
  {
    title: "Website content and intellectual property",
    paragraphs: [
      "Unless otherwise stated, the website's original text, design elements, branding and product photography are owned by or used with permission by their respective rights holders. You may not reproduce or commercially reuse protected content without permission, except as permitted by law."
    ]
  },
  {
    title: "Third-party services and links",
    paragraphs: [
      "Our website may use third-party services for payments, image delivery, hosting and other technical functions. Third-party websites and services may have their own policies. We are not responsible for the independent content of external websites, subject to applicable law."
    ]
  },
  {
    title: "Accuracy and availability of the website",
    paragraphs: [
      "We try to keep product details, prices and website functions accurate and available, but temporary errors, maintenance or interruptions can occur. We may update website content and correct mistakes when identified.",
      "Nothing in this section excludes obligations or remedies that apply under Indian law."
    ]
  },
  {
    title: "Prohibited activities",
    paragraphs: [
      "You must not upload malicious code, interfere with website operation, scrape customer data without authorization, impersonate another person, make fraudulent purchases or infringe the rights of others. We may restrict access where reasonably necessary to protect the website and its users."
    ]
  },
  {
    title: "Liability and consumer rights",
    paragraphs: [
      "We are responsible for our obligations to customers as required by applicable law. To the extent permitted by law, we are not responsible for losses caused solely by circumstances outside our reasonable control.",
      "These Terms do not exclude or restrict non-waivable statutory rights, including applicable rights relating to defective goods, misleading descriptions or refunds."
    ]
  },
  {
    title: "Changes to these Terms",
    paragraphs: [
      "We may revise these Terms from time to time. Updated terms will be published on this page with a revised date. Changes will not retrospectively remove rights already accrued under applicable law."
    ]
  },
  {
    title: "Governing law",
    paragraphs: [
      "These Terms are governed by the laws of India. Any dispute resolution or legal proceedings remain subject to the jurisdiction and consumer protection rights provided by applicable law."
    ]
  },
  {
    title: "Contact information",
    paragraphs: [
      "Threads & Tassels is an online boutique based in Aluva, Kerala, India. For questions about these Terms, orders or customer support, contact us using the details below."
    ]
  }
];

export default function Terms() {
  return (
    <main className="min-h-[75vh] bg-ivory px-4 py-12 text-chocolate sm:px-8 lg:py-16">
      <div className="mx-auto max-w-5xl">
        <header className="mb-9 text-center sm:mb-12">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8FA580]">THREADS & TASSELS</p>
          <h1 className="font-serif text-4xl sm:text-5xl">Terms &amp; Conditions</h1>
          <div className="mx-auto mt-5 h-px w-16 bg-gold" />
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-taupe">Please read these terms before shopping with us.</p>
          <p className="mt-3 text-xs text-taupe">Last updated: {LAST_UPDATED}</p>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[245px_minmax(0,1fr)] lg:gap-8">
          <aside className="hidden rounded-2xl border border-[#EAE2D8] bg-offwhite p-5 shadow-[0_5px_25px_rgba(74,46,31,0.04)] lg:sticky lg:top-28 lg:block">
            <div className="mb-4 flex items-center gap-2 border-b border-[#EAE2D8] pb-4">
              <FileText size={18} className="text-gold" />
              <span className="font-serif text-lg">On this page</span>
            </div>
            <nav aria-label="Terms sections" className="max-h-[65vh] space-y-1 overflow-y-auto pr-1">
              {sections.map((section, index) => (
                <a key={section.title} href={`#terms-${index + 1}`} className="block rounded-lg px-2 py-1.5 text-xs leading-5 text-chocolate/70 transition hover:bg-[#FAF7F1] hover:text-chocolate">
                  {index + 1}. {section.title}
                </a>
              ))}
            </nav>
          </aside>

          <article className="rounded-2xl border border-[#EAE2D8] bg-offwhite px-5 py-7 shadow-[0_5px_25px_rgba(74,46,31,0.04)] sm:px-9 sm:py-10">
            <div className="mb-8 flex items-start gap-3 rounded-xl bg-[#F3F5EC] p-4">
              <ShieldCheck size={21} className="mt-0.5 shrink-0 text-[#8FA580]" />
              <p className="text-sm leading-6 text-chocolate/80">Our terms explain how orders, delivery and customer support work. Your rights under applicable Indian law remain protected.</p>
            </div>
            <div className="space-y-9">
              {sections.map((section, index) => (
                <section key={section.title} id={`terms-${index + 1}`} className="scroll-mt-28">
                  <div className="mb-3 flex items-start gap-3">
                    <span className="mt-1 shrink-0 text-xs font-semibold tracking-widest text-gold">{String(index + 1).padStart(2, "0")}</span>
                    <h2 className="font-serif text-xl leading-snug text-chocolate sm:text-2xl">{section.title}</h2>
                  </div>
                  <div className="space-y-3 pl-8">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="text-sm leading-7 text-chocolate/75">{paragraph}</p>
                    ))}
                  </div>
                  {index < sections.length - 1 && <div className="mt-8 h-px bg-[#EAE2D8]" />}
                </section>
              ))}
            </div>

            <div className="mt-9 rounded-xl border border-[#EAE2D8] bg-[#FAF7F1] p-5 sm:p-6">
              <h3 className="font-serif text-xl text-chocolate">Need assistance?</h3>
              <div className="mt-4 space-y-3 text-sm text-chocolate/75">
                <a href={`mailto:${SUPPORT_EMAIL}`} className="flex items-center gap-2 break-all hover:text-chocolate"><Mail size={17} className="shrink-0 text-gold" />{SUPPORT_EMAIL}</a>
                <p className="flex items-center gap-2"><MapPin size={17} className="shrink-0 text-gold" />Threads &amp; Tassels, Aluva, Kerala, India</p>
              </div>
              <Link to="/contact" className="mt-5 inline-flex items-center gap-2 rounded-full border border-gold px-5 py-2.5 text-xs font-medium text-chocolate transition hover:bg-chocolate hover:text-white">Contact Us <ArrowUpRight size={15} /></Link>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
