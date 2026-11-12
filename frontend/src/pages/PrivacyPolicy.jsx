import { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Mail, MapPin, ArrowUpRight } from "lucide-react";

const UPDATED = "5 November 2026";
const SUPPORT_EMAIL = "threadsandtassels@gmail.com"; // Replace before launch.

const sections = [
  {
    id: "information-collected",
    title: "Information we collect",
    paragraphs: [
      "When you register, place an order, contact us or otherwise use Threads & Tassels, we may collect your name, email address, phone number, account details, delivery address, order details and communications with our team.",
      "We also process information needed to operate the website, such as authentication cookies, basic device and request information, and technical logs used for security and troubleshooting.",
      "Payments are handled through Razorpay. We receive transaction-related information such as payment status, transaction identifiers and amounts, but we do not need to store your full card number or card security code on our website."
    ]
  },
  {
    id: "how-we-use",
    title: "How we use your information",
    bullets: [
      "Create and manage customer accounts and authenticate sign-ins.",
      "Process purchases, payments, order updates and delivery arrangements.",
      "Respond to enquiries, product issues and exchange requests.",
      "Maintain website functionality, detect misuse and improve reliability.",
      "Keep necessary business records and comply with applicable legal obligations."
    ]
  },
  {
    id: "sharing",
    title: "When we share information",
    paragraphs: [
      "We do not sell customer personal information. We may share only the information reasonably necessary with service providers involved in running the store, such as payment processors, hosting and database providers, and shipping or delivery partners.",
      "We may also disclose information where required by applicable law or a valid legal process. Service providers process information according to their own roles and applicable contractual or legal requirements."
    ]
  },
  {
    id: "payments",
    title: "Payment processing",
    paragraphs: [
      "Online payments are processed by Razorpay and its payment partners. Payment methods, verification steps and transaction handling may be subject to their respective privacy notices and terms.",
      "We use payment confirmations and transaction references to reconcile orders, assist with payment issues and maintain required records."
    ]
  },
  {
    id: "cookies",
    title: "Cookies and website technology",
    paragraphs: [
      "Our website uses cookies or similar browser technologies that are necessary for functions such as maintaining a signed-in session and operating the shopping experience.",
      "You may be able to block or clear cookies through your browser settings. Disabling essential cookies may prevent login and some account or checkout features from working.",
      "If we introduce optional analytics or advertising trackers in the future, we will review and update this policy and any applicable consent arrangements before using them."
    ]
  },
  {
    id: "security",
    title: "How we protect information",
    paragraphs: [
      "We use reasonable technical and organizational safeguards appropriate to the operation of our website, including access controls and measures designed to protect account credentials and transactions.",
      "No online system or method of electronic storage can be guaranteed completely secure. Please protect your login credentials and contact us if you suspect unauthorized access to your account."
    ]
  },
  {
    id: "retention",
    title: "How long we retain information",
    paragraphs: [
      "We retain personal information for as long as reasonably necessary to provide the store's services, maintain order and payment records, resolve disputes, protect the website and meet applicable legal obligations.",
      "Retention periods may differ depending on the type of information and the purpose for which it is needed. We will review deletion requests subject to any lawful reason to retain records."
    ]
  },
  {
    id: "rights",
    title: "Your privacy choices and rights",
    paragraphs: [
      "You may contact us to request access to, correction of or deletion of personal information associated with your account, or to raise a privacy concern. We will assess and respond to requests in accordance with applicable Indian law and any relevant exceptions.",
      "Some order, transaction or compliance records may need to be retained even after an account-related deletion request. We may ask for reasonable information to verify your identity before acting on a request."
    ]
  },
  {
    id: "children",
    title: "Children's privacy",
    paragraphs: [
      "Our store is intended for customers who are legally able to make purchases. We do not intentionally design our services for children to independently register or place orders.",
      "If you believe a child has provided personal information without appropriate authorization, please contact us so we can review the situation in accordance with applicable law."
    ]
  },
  {
    id: "third-parties",
    title: "Third-party services and links",
    paragraphs: [
      "Our website may link to external services such as WhatsApp, Instagram and payment-provider pages. Their handling of information is governed by their own privacy practices, which we encourage you to review."
    ]
  },
  {
    id: "changes",
    title: "Changes to this policy",
    paragraphs: [
      "We may revise this Privacy Policy when our services, data practices or legal requirements change. The latest version will be posted on this page with an updated revision date."
    ]
  },
  {
    id: "contact",
    title: "Contact us",
    paragraphs: [
      "For questions, concerns or requests relating to personal information, contact Threads & Tassels using the details below."
    ]
  }
];

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState(sections[0].id);

  return (
    <main className="min-h-screen bg-ivory text-chocolate">
      <div className="border-b border-[#EAE2D8] bg-[#FFFCF8]">
        <div className="mx-auto max-w-6xl px-5 py-12 text-center sm:px-8 sm:py-16">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-sage">YOUR PRIVACY MATTERS</p>
          <h1 className="font-serif text-4xl leading-tight sm:text-5xl">Privacy Policy</h1>
          <div className="mx-auto mt-5 h-px w-16 bg-gold" />
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-taupe">
            Learn how Threads & Tassels collects, uses and protects information when you browse or shop with us.
          </p>
          <p className="mt-4 text-xs text-taupe">Last updated: {UPDATED}</p>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl items-start gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[255px_minmax(0,1fr)] lg:gap-10 lg:py-14">
        <aside className="hidden lg:sticky lg:top-28 lg:block">
          <div className="rounded-2xl border border-[#EAE2D8] bg-offwhite p-5 shadow-[0_6px_24px_rgba(74,46,31,0.04)]">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe">On this page</p>
            <nav aria-label="Privacy policy sections" className="space-y-1">
              {sections.map((section, index) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={() => setActiveSection(section.id)}
                  className={`block rounded-lg px-3 py-2 text-xs leading-5 transition-colors ${activeSection === section.id ? "bg-[#F5EEE2] font-semibold text-chocolate" : "text-taupe hover:bg-[#F8F2E9] hover:text-chocolate"}`}
                >
                  <span className="mr-2 text-gold">{String(index + 1).padStart(2, "0")}</span>
                  {section.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <div className="min-w-0 space-y-6">
          <div className="flex items-start gap-4 rounded-2xl border border-[#EAE2D8] bg-offwhite p-5 sm:p-6">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E7F1E5] text-sage"><ShieldCheck size={22} strokeWidth={1.6} /></span>
            <div>
              <h2 className="font-serif text-lg">Our commitment</h2>
              <p className="mt-1 text-sm leading-7 text-taupe">We use customer information to operate our online boutique, fulfil orders and provide support. This policy explains our practices and how to reach us about your data.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#EAE2D8] bg-offwhite px-5 py-2 shadow-[0_6px_24px_rgba(74,46,31,0.04)] sm:px-8">
            {sections.map((section, index) => (
              <section key={section.id} id={section.id} className="scroll-mt-28 border-b border-[#EAE2D8] py-7 last:border-b-0 sm:py-8">
                <div className="mb-4 flex items-baseline gap-3">
                  <span className="text-xs font-semibold tracking-widest text-gold">{String(index + 1).padStart(2, "0")}</span>
                  <h2 className="font-serif text-xl leading-snug sm:text-2xl">{section.title}</h2>
                </div>
                <div className="space-y-3 text-sm leading-7 text-chocolate/75">
                  {section.paragraphs?.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
                  {section.bullets && (
                    <ul className="list-disc space-y-2 pl-5 marker:text-gold">
                      {section.bullets.map((bullet, i) => <li key={i}>{bullet}</li>)}
                    </ul>
                  )}
                  {section.id === "contact" && (
                    <div className="mt-4 space-y-3 rounded-xl bg-[#F8F5EF] p-4">
                      <a href={`mailto:${SUPPORT_EMAIL}`} className="flex items-center gap-3 break-all hover:text-gold"><Mail size={17} className="shrink-0 text-sage" />{SUPPORT_EMAIL}</a>
                      <p className="flex items-center gap-3"><MapPin size={17} className="shrink-0 text-sage" />Threads & Tassels, Aluva, Kerala, India</p>
                      <Link to="/contact" className="inline-flex items-center gap-2 font-semibold text-sage hover:text-gold">Contact Us <ArrowUpRight size={16} /></Link>
                    </div>
                  )}
                </div>
              </section>
            ))}
          </div>
          <p className="text-center text-xs leading-6 text-taupe">For order-related policies, please also review our <Link className="underline decoration-gold underline-offset-4 hover:text-gold" to="/terms-and-conditions">Terms & Conditions</Link>.</p>
        </div>
      </div>
    </main>
  );
}
