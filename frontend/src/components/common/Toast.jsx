
import { useEffect } from "react";
import { CheckCircle2, X, AlertCircle } from "lucide-react";

function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, type, onClose]);

  if (!message) return null;

  const success = type === "success";

  return (
    <div className="pointer-events-none fixed inset-x-0 top-5 z-[9999] flex justify-center px-4">
      <div
        role={success ? "status" : "alert"}
        className="pointer-events-auto flex w-full max-w-sm animate-[toastSlideIn_0.35s_ease-out] items-center gap-3 rounded-xl border border-[#EAE2D8] bg-[#FFFCF8] px-4 py-3 shadow-[0_12px_35px_rgba(74,46,31,0.15)]"
      >
        {success ? (
          <CheckCircle2
            size={22}
            className="shrink-0 text-[#638459]"
          />
        ) : (
          <AlertCircle
            size={22}
            className="shrink-0 text-red-600"
          />
        )}

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[#4A2E1F]">
            {success ? "Added to Cart!" : "Something went wrong"}
          </p>

          <p className="mt-0.5 text-xs text-[#8A786D]">
            {message}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          className="shrink-0 text-[#A7A7A5] transition-colors hover:text-[#4A2E1F]"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

export default Toast;
