import { Link } from "react-router-dom";
import { ArrowUpRight, Truck, Mail, MapPin, PackageCheck } from "lucide-react";

const LAST_UPDATED = "6 November 2026";
const SUPPORT_EMAIL = "example@email.com"; // Replace with the real support email before launch.

const sections = [
  {
    title: "Shipping overview",
    paragraphs: [
      "Threads & Tassels is an online boutique selling salwar materials and fabrics. We aim to pack and deliver orders carefully and keep customers informed when shipping issues arise.",
      "This policy applies to orders placed through our website for delivery within India."
    ]
  },
  {
    title: "Order processing",
    paragraphs: [
      "Orders are prepared for dispatch after successful payment and order confirmation, subject to stock availability and operational requirements.",
      "We have not established a fixed processing-time commitment. Processing may take longer during holidays, non-working days, high order volumes or other unexpected circumstances."
    ]
  },
  {
    title: "Delivery estimates",
    paragraphs: [
      "Delivery normally takes approximately 3–5 days, but this is an estimate rather than a guaranteed delivery date. The estimate may vary by destination and courier service.",
      "Traffic, transport disruptions, courier delays, weather, public holidays, non-working days and other circumstances outside our reasonable control may affect delivery. Please contact us if you need help with a delayed order."
    ]
  },
  {
    title: "Shipping destinations",
    paragraphs: [
      "Our website currently accepts shipping addresses within India only.",
      "International customers may contact us through WhatsApp to discuss a possible order separately. International shipping is not offered through website checkout, and any separate arrangement is subject to confirmation."
    ]
  },
  {
    title: "Shipping charges",
    paragraphs: [
      "Standard shipping for orders placed through our website to eligible addresses within India is free. We do not currently advertise paid express or overnight shipping options.",
      "If an address is not serviceable, we will contact the customer to discuss available options, including an appropriate payment resolution if we cannot fulfil a paid order."
    ]
  },
  {
    title: "Tracking and order updates",
    paragraphs: [
      "Customers can check available order information through their account on our website. Tracking details may be provided when they are available from the delivery partner.",
      "We do not guarantee that every shipment will have a live tracking link or that an automatic dispatch email or message will be sent. Contact our support team if you need a shipping update."
    ]
  },
  {
    title: "Shipping address accuracy",
    paragraphs: [
      "Please enter your complete name, phone number, PIN code and delivery address accurately at checkout. Incorrect or incomplete information may cause delays, failed delivery attempts or additional courier handling.",
      "If you notice an address mistake, contact us immediately. We cannot guarantee that an address can be changed once an order has been prepared or dispatched."
    ]
  },
  {
    title: "Delivery attempts and unavailable recipients",
    paragraphs: [
      "Delivery attempts and any re-delivery arrangements depend on the courier's procedures and service availability. Please keep your contact number reachable and follow any legitimate delivery instructions from the courier.",
      "If a parcel is returned because delivery could not be completed, contact us so we can review the circumstances and discuss the next steps."
    ]
  },
  {
    title: "Damaged, incorrect or missing deliveries",
    paragraphs: [
      "If a parcel arrives damaged, or the product is defective or incorrect, please contact us within 24 hours of delivery wherever possible. Share your order number, clear photographs and an unedited parcel-opening (unboxing) video, where available, to help us investigate.",
      "Our general policy does not provide routine returns or monetary refunds for completed purchases. Eligible product issues are reviewed for an exchange, subject to the circumstances and product availability. If a shipment appears lost or is marked delivered but cannot be located, contact us promptly so we can investigate with the courier.",
      "The suggested reporting period and supporting evidence do not remove any rights or remedies available under applicable consumer protection law."
    ]
  },
  {
    title: "Changes, delays and unfulfilled orders",
    paragraphs: [
      "We may contact you if dispatch is delayed, the delivery location is not serviceable, or an ordered item becomes unavailable. We will explain the situation and discuss the available resolution.",
      "If we cannot fulfil a paid order, any refund or other remedy legally due will be provided. We do not guarantee a fixed courier delivery date or a fixed processing period."
    ]
  },
  {
    title: "Related policies",
    paragraphs: [
      "Please read our Terms & Conditions and Refund & Exchange Policy for information about order cancellations, damaged products, exchanges and any legally required remedies."
    ]
  },
  {
    title: "Contact us",
    paragraphs: [
      "For shipping questions, contact Threads & Tassels at the email below or through our Contact Us page. Our business location is Aluva, Kerala, India."
    ]
  }
];

export default function ShippingPolicy() {
  return (
    <main className="min-h-[75vh] bg-ivory px-4 py-12 text-chocolate sm:px-8 lg:py-16">
      <div className="mx-auto max-w-5xl">
        <header className="mb-9 text-center sm:mb-12">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8FA580]">THREADS &amp; TASSELS</p>
          <h1 className="font-serif text-4xl sm:text-5xl">Shipping &amp; Delivery Policy</h1>
          <div className="mx-auto mt-5 h-px w-16 bg-gold" />
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-taupe">Everything you need to know about shipping, delivery estimates and order support.</p>
          <p className="mt-3 text-xs text-taupe">Last updated: {LAST_UPDATED}</p>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[245px_minmax(0,1fr)] lg:gap-8">
          <aside className="hidden rounded-2xl border border-[#EAE2D8] bg-offwhite p-5 shadow-[0_5px_25px_rgba(74,46,31,0.04)] lg:sticky lg:top-28 lg:block">
            <div className="mb-4 flex items-center gap-2 border-b border-[#EAE2D8] pb-4">
              <Truck size={18} className="text-gold" />
              <span className="font-serif text-lg">On this page</span>
            </div>
            <nav aria-label="Shipping policy sections" className="max-h-[65vh] space-y-1 overflow-y-auto pr-1">
              {sections.map((section, index) => (
                <a key={section.title} href={`#shipping-${index + 1}`} className="block rounded-lg px-2 py-1.5 text-xs leading-5 text-chocolate/70 transition hover:bg-[#FAF7F1] hover:text-chocolate">
                  {index + 1}. {section.title}
                </a>
              ))}
            </nav>
          </aside>

          <article className="rounded-2xl border border-[#EAE2D8] bg-offwhite px-5 py-7 shadow-[0_5px_25px_rgba(74,46,31,0.04)] sm:px-9 sm:py-10">
            <div className="mb-8 flex items-start gap-3 rounded-xl bg-[#F3F5EC] p-4">
              <PackageCheck size={21} className="mt-0.5 shrink-0 text-[#8FA580]" />
              <p className="text-sm leading-6 text-chocolate/80"><strong>Free shipping within India.</strong> Delivery normally takes about 3–5 days, although actual arrival times may vary.</p>
            </div>

            <div className="space-y-9">
              {sections.map((section, index) => (
                <section key={section.title} id={`shipping-${index + 1}`} className="scroll-mt-28">
                  <div className="mb-3 flex items-start gap-3">
                    <span className="mt-1 shrink-0 text-xs font-semibold tracking-widest text-gold">{String(index + 1).padStart(2, "0")}</span>
                    <h2 className="font-serif text-xl leading-snug text-chocolate sm:text-2xl">{section.title}</h2>
                  </div>
                  <div className="space-y-3 pl-8">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="text-sm leading-7 text-chocolate/75">{paragraph}</p>
                    ))}
                    {section.title === "Related policies" && (
                      <div className="flex flex-wrap gap-4 pt-2 text-sm">
                        <Link to="/terms-and-conditions" className="font-medium text-[#8FA580] underline underline-offset-4 hover:text-chocolate">Terms &amp; Conditions</Link>
                        <Link to="/refund-policy" className="font-medium text-[#8FA580] underline underline-offset-4 hover:text-chocolate">Refund &amp; Exchange Policy</Link>
                      </div>
                    )}
                  </div>
                  {index < sections.length - 1 && <div className="mt-8 h-px bg-[#EAE2D8]" />}
                </section>
              ))}
            </div>

            <div className="mt-9 rounded-xl border border-[#EAE2D8] bg-[#FAF7F1] p-5 sm:p-6">
              <h3 className="font-serif text-xl text-chocolate">Need shipping assistance?</h3>
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
