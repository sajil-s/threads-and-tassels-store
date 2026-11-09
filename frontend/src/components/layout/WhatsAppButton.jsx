
import { FaWhatsapp } from "react-icons/fa6";

function WhatsAppButton() {
  const phoneNumber = "7338662124";

  const message =
    "Hello Threads & Tassels! I would like to know more about your salwar materials.";

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Threads & Tassels on WhatsApp"
      title="Chat with us on WhatsApp"
      className="
        group fixed bottom-6 right-5 z-40
        flex h-13 w-13 items-center justify-center
        rounded-full bg-[#25D366] text-white
        shadow-[0_5px_20px_rgba(37,211,102,0.3)]
        transition-all duration-300
        hover:-translate-y-1 hover:scale-105
        hover:shadow-[0_8px_25px_rgba(37,211,102,0.45)]
        focus-visible:outline-2 focus-visible:outline-offset-4
        focus-visible:outline-[#25D366]
        sm:bottom-8 sm:right-8 sm:h-14 sm:w-14
      "
    >
      <FaWhatsapp
        size={27}
        className="transition-transform duration-300 group-hover:scale-110 sm:text-[30px]"
      />

      {/* Desktop tooltip */}
      <span
        className="
          pointer-events-none absolute right-full mr-3
          hidden whitespace-nowrap rounded-lg
          bg-chocolate px-3 py-2
          text-xs font-medium text-white
          opacity-0 shadow-md
          transition-opacity duration-300
          group-hover:opacity-100
          lg:block
        "
      >
        Chat with us
      </span>
    </a>
  );
}

export default WhatsAppButton;
