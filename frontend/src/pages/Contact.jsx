import { useState } from "react";
import {
  Mail,
  Phone,
  MessageCircle,
  ArrowUpRight,
    MapPin,
  Send,
} from "lucide-react";

const contact = {
  businessName: "Threads & Tassels",
  address: "Aluva, Kerala, India",
  email: "threadsandtasswls07@gmail.com",
  phone: "+91 7338662124",
  displayPhone: "+91 7338662124",
};

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const update = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const subject = encodeURIComponent(
      `Enquiry from ${form.name}`
    );

    const body = encodeURIComponent(
      `Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    );

    window.location.href =
      `mailto:${contact.email}?subject=${subject}&body=${body}`;
  };

  const inputStyle =
    "w-full border-0 border-b border-[#EAE2D8] bg-transparent px-0 py-3 text-sm text-chocolate outline-none placeholder:text-taupe focus:border-gold";

  return (
    <section className="min-h-[75vh] bg-ivory px-4 py-12 sm:px-8 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#8FA580]">
            GET IN TOUCH
          </p>

          <h1 className="font-serif text-4xl text-chocolate sm:text-5xl">
            Contact Us
          </h1>

          <div className="mx-auto mt-5 h-px w-16 bg-gold" />

          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-taupe">
            Have a question about our fabrics, orders or deliveries?
            We're here to help.
          </p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Contact information card */}
          <div className="overflow-hidden rounded-2xl border border-[#EAE2D8] bg-offwhite shadow-[0_5px_25px_rgba(74,46,31,0.05)]">
            <div className="border-b border-[#EAE2D8] p-6 sm:p-8">
              <h2 className="font-serif text-2xl text-chocolate">
                Contact Information
              </h2>
              <p className="mt-2 text-sm text-taupe">
                Connect with our online support team.
              </p>
            </div>

            <div className="divide-y divide-[#EAE2D8] px-6 sm:px-8">
              {[
                {
  title: "BUSINESS ADDRESS",
  value: `${contact.businessName}, ${contact.address}`,
  href: "https://www.google.com/maps/search/?api=1&query=Aluva%2C%20Kerala%2C%20India",
  icon: MapPin,
},
                {
                  title: "WHATSAPP",
                  value: contact.displayPhone,
                  href: `https://wa.me/${contact.phone.replace(/\D/g, "")}`,
                  icon: MessageCircle,
                },
                {
                  title: "PHONE",
                  value: contact.displayPhone,
                  href: `tel:${contact.phone}`,
                  icon: Phone,
                },
                {
                  title: "EMAIL",
                  value: contact.email,
                  href: `mailto:${contact.email}`,
                  icon: Mail,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.title}
                    href={item.href}
                    target={item.title === "WHATSAPP" ? "_blank" : undefined}
                    rel={item.title === "WHATSAPP" ? "noopener noreferrer" : undefined}
                    className="group flex items-center gap-4 py-6"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E7F5E8] text-[#459A78]">
                      <Icon size={20} strokeWidth={1.7} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold tracking-[0.18em] text-taupe">
                        {item.title}
                      </p>
                      <p className="mt-1 break-all text-sm text-chocolate">
                        {item.value}
                      </p>
                    </div>

                    <ArrowUpRight
                      size={18}
                      className="text-gold transition-transform group-hover:translate-x-1"
                    />
                  </a>
                );
              })}
            </div>

            <div className="bg-[#F8F2E9] px-6 py-5 sm:px-8">
              <p className="text-xs leading-6 text-taupe">
                Threads & Tassels is an online boutique.
                Contact us for product enquiries, order assistance
                and delivery support.
              </p>
            </div>
          </div>

          {/* Message card */}
          <div className="rounded-2xl border border-[#EAE2D8] bg-offwhite p-6 shadow-[0_5px_25px_rgba(74,46,31,0.05)] sm:p-8">
            <h2 className="font-serif text-2xl text-chocolate">
              Send us a message
            </h2>

            <p className="mt-2 text-sm text-taupe">
              Fill in the form to prepare an email to our team.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-6">
              <label className="block">
                <span className="text-xs font-medium text-chocolate">
                  Full Name *
                </span>
                <input
                  name="name"
                  required
                  maxLength={100}
                  value={form.name}
                  onChange={update}
                  placeholder="Your full name"
                  className={inputStyle}
                />
              </label>

              <label className="block">
                <span className="text-xs font-medium text-chocolate">
                  Phone Number
                </span>
                <input
                  type="tel"
                  name="phone"
                  maxLength={20}
                  value={form.phone}
                  onChange={update}
                  placeholder="+91 98765 43210"
                  className={inputStyle}
                />
              </label>

              <label className="block">
                <span className="text-xs font-medium text-chocolate">
                  Email Address *
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={update}
                  placeholder="you@example.com"
                  className={inputStyle}
                />
              </label>

              <label className="block">
                <span className="text-xs font-medium text-chocolate">
                  Message *
                </span>
                <textarea
                  name="message"
                  required
                  rows={5}
                  maxLength={3000}
                  value={form.message}
                  onChange={update}
                  placeholder="How can we help you?"
                  className={`${inputStyle} resize-y`}
                />
              </label>

              <button
                type="submit"
                className="inline-flex items-center gap-3 rounded-full bg-[#8FA580] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#718B64]"
              >
                Compose Email
                <Send size={16} />
              </button>

              <p className="text-xs text-taupe">
                Your email application will open. Press Send there
                to deliver your message.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}