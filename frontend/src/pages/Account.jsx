
import {  useState, } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserRound,
  Package,
  ChevronRight,
  LogOut,
  Mail,
  Phone,
  
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

import Reveal from "../components/common/Reveal";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-blue-50 text-blue-700",
  processing: "bg-purple-50 text-purple-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
  returned: "bg-gray-100 text-gray-700",
};

function formatPrice(amount) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Account() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  

  async function handleLogout() {
    try {
      setLoggingOut(true);
      setLogoutError("");

      await logout();

      navigate("/", { replace: true });
    } catch (error) {
      setLogoutError(
        error.response?.data?.message ||
          "Logout failed. Please try again."
      );
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <section className="min-h-[75vh] bg-ivory px-5 py-12 sm:px-8 lg:py-16">
      <div className="mx-auto max-w-5xl">

        {/* Page Heading */}
        <Reveal>
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-taupe">
              Threads & Tassels
            </p>

            <h1 className="font-serif text-4xl text-chocolate sm:text-5xl">
              My Account
            </h1>

            <div className="mx-auto mt-5 h-px w-16 bg-gold" />

            <p className="mt-5 text-sm text-taupe">
              Manage your details and follow your orders.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-7 lg:grid-cols-[320px_1fr]">

          {/* Personal Details */}
          <Reveal>
            <div className="rounded-2xl border border-[#EAE2D8] bg-offwhite p-6 shadow-[0_5px_25px_rgba(74,46,31,0.04)]">
              <div className="mb-6 flex items-center gap-3 border-b border-[#EAE2D8] pb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-chocolate">
                  <UserRound size={23} strokeWidth={1.5} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-taupe">
                    Welcome back
                  </p>

                  <h2 className="truncate font-serif text-xl text-chocolate">
                    {user?.fullName || "Customer"}
                  </h2>
                </div>
              </div>

              <h3 className="mb-5 text-sm font-semibold text-chocolate">
                Personal Details
              </h3>

              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <UserRound size={17} className="mt-0.5 shrink-0 text-gold" />

                  <div className="min-w-0">
                    <p className="text-xs text-taupe">Full Name</p>
                    <p className="mt-1 break-words text-sm text-chocolate">
                      {user?.fullName || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail size={17} className="mt-0.5 shrink-0 text-gold" />

                  <div className="min-w-0">
                    <p className="text-xs text-taupe">Email Address</p>
                    <p className="mt-1 break-all text-sm text-chocolate">
                      {user?.email || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone size={17} className="mt-0.5 shrink-0 text-gold" />

                  <div>
                    <p className="text-xs text-taupe">Mobile Number</p>
                    <p className="mt-1 text-sm text-chocolate">
                      {user?.phone ? `+91 ${user.phone}` : "—"}
                    </p>
                  </div>
                </div>
              </div>

              
            </div>
          </Reveal>

          {/* My Orders */}
          <Reveal>
  <Link
    to="/account/orders"
    className="group flex items-center justify-between rounded-2xl border border-[#EAE2D8] bg-offwhite p-6 shadow-[0_5px_25px_rgba(74,46,31,0.04)] transition-all duration-300 hover:border-gold hover:shadow-md"
  >
    <div className="flex items-center gap-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gold/10 text-chocolate">
        <Package size={26} strokeWidth={1.5} />
      </div>

      <div>
        <h2 className="font-serif text-xl text-chocolate sm:text-2xl">
          My Orders
        </h2>

        <p className="mt-1 text-xs text-taupe sm:text-sm">
          View your orders, delivery status and tracking details.
        </p>
      </div>
    </div>

    <ChevronRight
      size={21}
      className="shrink-0 text-gold transition-transform duration-300 group-hover:translate-x-1"
    />
  </Link>
</Reveal>
        </div>
        <div className="mt-8 border-t border-[#EAE2D8] pt-6">
                {logoutError && (
                  <p role="alert" className="mb-3 text-xs text-red-600">
                    {logoutError}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#EAE2D8] px-4 py-3 text-sm font-medium text-chocolate transition-colors hover:border-gold hover:bg-gold/10 disabled:opacity-50"
                >
                  <LogOut size={17} />
                  {loggingOut ? "Logging Out..." : "Log Out"}
                </button>
              </div>
             

      </div>
    </section>
  );
}

export default Account;
