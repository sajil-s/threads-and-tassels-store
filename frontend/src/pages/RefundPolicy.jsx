import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronDown, Mail, ShieldCheck } from "lucide-react";

const sections = [
  {
    title: "Our return and exchange policy",
    paragraphs: [
      "Threads & Tassels sells salwar materials and fabrics through its online store. We do not offer routine returns, exchanges, or monetary refunds for change of mind, personal preferences, or an incorrect selection made by a customer.",
      "If an item is damaged, defective, or different from the product ordered, we will review the concern and discuss an appropriate resolution. Our preferred resolution for an eligible product issue is an exchange. This policy does not restrict remedies available under applicable Indian law."
    ]
  },
  {
    title: "Items not eligible for routine return",
    bullets: [
      "Products that a customer no longer wants after placing an order.",
      "Products ordered in the wrong colour, design, material, or quantity due to the customer's selection.",
      "Requests based solely on personal preference or a change of mind.",
      "Products damaged through customer misuse or improper handling after delivery."
    ],
    paragraphs: ["These exclusions do not override any legal rights relating to defective, misdescribed, or incorrectly supplied goods."]
  },
  {
    title: "Damaged, defective, or incorrect items",
    paragraphs: [
      "If you receive a damaged, defective, or incorrect item, please contact our support team within 24 hours of delivery, wherever possible, so we can investigate promptly.",
      "We request your order number, clear photographs of the issue, and an unedited parcel-opening (unboxing) video where available. We may ask for additional information reasonably needed to assess the concern.",
      "The 24-hour reporting request and unboxing-video request help us investigate issues. They do not automatically remove rights or remedies available under applicable consumer protection law."
    ]
  },
  {
    title: "How to request an exchange",
    bullets: [
      "Contact us at example@email.com or through our Contact Us page.",
      "Share your order number, delivery date, and a description of the issue.",
      "Provide photographs and an unedited unboxing video, if available.",
      "Wait for our team to review your request and provide instructions. Do not send the product back before receiving return-shipping instructions."
    ],
    paragraphs: ["Submitting a request does not automatically mean an exchange is approved. We assess each case based on the circumstances and available evidence."]
  },
  {
    title: "Exchange approval and availability",
    paragraphs: [
      "If an exchange is approved, we will discuss the replacement product and next steps with you. Replacement availability may vary depending on stock.",
      "If the original item is unavailable, we will discuss an appropriate alternative resolution, including any remedy required by applicable law. We do not promise an automatic exchange or a fixed replacement-dispatch date before review."
    ]
  },
  {
    title: "Refund policy",
    paragraphs: [
      "Threads & Tassels generally does not provide monetary refunds for completed purchases. For eligible product-related complaints, we prefer to resolve the matter through an exchange.",
      "This does not exclude refunds or other remedies where required by law, where an order cannot be fulfilled, or where a payment has been taken without a valid completed order. Any necessary refund will be reviewed and handled manually through an appropriate payment method. Processing time can depend on the payment provider and bank."
    ]
  },
  {
    title: "Order cancellations",
    paragraphs: [
      "Orders generally cannot be cancelled by customers after they have been successfully placed and confirmed. If there is an exceptional problem with your order, contact our team as soon as possible. We will review the situation, including any obligations under applicable law."
    ]
  },
  {
    title: "Return shipping and exchange logistics",
    paragraphs: [
      "If we approve an exchange, our team will provide instructions about returning the affected item, if a return is necessary. Please do not ship an item to our business location without prior instructions.",
      "Who pays return shipping, the collection method, and the exchange-dispatch timeline are not yet finalized. These details will be communicated before an approved exchange is arranged. Any legal obligations concerning defective or incorrect goods will be respected."
    ]
  },
  {
    title: "Delivery and shipping",
    paragraphs: [
      "Standard shipping for orders placed through our website is free within India. Delivery normally takes approximately 3–5 days, but this is an estimate rather than a guarantee. Non-working days, courier delays, traffic, weather, location, and other factors may affect delivery.",
      "International orders are not available through website checkout. Customers outside India may contact us through WhatsApp to enquire about possible arrangements."
    ]
  },
  {
    title: "Contact information",
    paragraphs: [
      "For questions about exchanges, product issues, or payments, contact Threads & Tassels at threadsandtassels@gmail.com.",
      "Business location: Threads & Tassels, Aluva, Kerala, India. This is an online boutique; please contact us before attempting to return or deliver a parcel in person."
    ]
  }
];

export default function RefundPolicy() {
  const [openSection, setOpenSection] = useState(null);

  return (
    <main className="min-h-screen bg-ivory text-chocolate">
      <section className="border-b border-[#EAE2D8] bg-[#FFFCF8] px-5 py-12 text-center sm:py-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-sage">Customer care & policies</p>
        <h1 className="mx-auto mt-4 max-w-3xl font-serif text-4xl leading-tight sm:text-5xl">Refund, Return & Exchange Policy</h1>
        <div className="mx-auto mt-5 h-px w-16 bg-gold" />
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-taupe">Please read how we handle damaged items, exchange requests, cancellations, and exceptional payment issues.</p>
        <p className="mt-4 text-xs text-taupe">Last updated: 6 November 2026</p>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12 lg:py-14">
        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded-2xl border border-[#EAE2D8] bg-offwhite p-5 shadow-[0_5px_25px_rgba(74,46,31,0.04)]">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">On this page</p>
            <nav className="space-y-1">
              {sections.map((section, index) => (
                <a key={section.title} href={`#policy-${index + 1}`} className="block rounded-lg px-3 py-2 text-xs leading-5 text-chocolate/75 transition-colors hover:bg-ivory hover:text-chocolate">
                  {String(index + 1).padStart(2, "0")}. {section.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="mb-7 flex items-start gap-3 rounded-2xl border border-[#EAE2D8] bg-[#FFFCF8] p-5 sm:p-6">
            <ShieldCheck className="mt-0.5 shrink-0 text-sage" size={22} strokeWidth={1.6} />
            <div>
              <h2 className="font-serif text-lg">Our exchange-first approach</h2>
              <p className="mt-2 text-sm leading-7 text-chocolate/75">We do not accept routine returns or offer routine refunds. We review damaged, defective, and incorrect items individually and prefer an exchange where appropriate, while respecting applicable consumer rights.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#EAE2D8] bg-offwhite px-5 py-2 shadow-[0_5px_25px_rgba(74,46,31,0.04)] sm:px-9">
            {sections.map((section, index) => (
              <section id={`policy-${index + 1}`} key={section.title} className="scroll-mt-28 border-b border-[#EAE2D8] py-7 last:border-b-0 sm:py-8">
                <button type="button" onClick={() => setOpenSection(openSection === index ? null : index)} className="flex w-full items-center justify-between gap-3 text-left lg:cursor-default" aria-expanded={openSection === index}>
                  <h2 className="font-serif text-xl leading-snug sm:text-2xl"><span className="mr-3 font-sans text-xs font-semibold tracking-wider text-gold">{String(index + 1).padStart(2, "0")}</span>{section.title}</h2>
                  <ChevronDown className={`shrink-0 text-gold transition-transform lg:hidden ${openSection === index ? "rotate-180" : ""}`} size={18} />
                </button>
                <div className={`${openSection === index ? "block" : "hidden"} mt-4 space-y-4 lg:block`}>
                  {section.paragraphs?.map((paragraph, i) => <p key={i} className="text-sm leading-7 text-chocolate/75">{paragraph}</p>)}
                  {section.bullets && <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-chocolate/75">{section.bullets.map((bullet, i) => <li key={i}>{bullet}</li>)}</ul>}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-[#EAE2D8] bg-[#F8F2E9] p-6 sm:p-8">
            <h2 className="font-serif text-2xl">Need help with an order?</h2>
            <p className="mt-3 text-sm leading-7 text-chocolate/75">Contact our team with your order number and details of the issue. For damage claims, please reach out as soon as possible.</p>
            <div className="mt-5 flex flex-wrap items-center gap-5">
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-sage px-5 py-3 text-xs font-semibold text-white transition-opacity hover:opacity-90">Contact Us <ArrowUpRight size={15} /></Link>
              <a href="threadsandtassels@gmail.com" className="inline-flex items-center gap-2 text-sm text-chocolate hover:text-gold"><Mail size={16} /> threadsandtassels@gmail.com</a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
