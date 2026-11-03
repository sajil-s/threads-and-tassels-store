
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tags,
  Store,
  LogOut,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const links = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Products", to: "/admin/products", icon: Package },
  { label: "Orders", to: "/admin/orders", icon: ShoppingBag },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Offers", to: "/admin/offers", icon: Tags },
];

export default function AdminSidebar({ open, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      onClose();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Admin logout failed:", error);
    }
  }

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-65 flex-col border-r border-[#EAE2D8] bg-[#FFFCF8] transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex min-h-35 items-center justify-between border-b border-[#EAE2D8] px-5">
          <div className="flex flex-col gap-1">
            <span className="font-serif text-xl text-[#4A2E1F]">
              Threads & Tassels
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A46A]">
              Administration
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="text-[#4A2E1F] lg:hidden"
          >
            <X size={21} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-7">
          {links.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors ${
                  isActive
                    ? "bg-[#F5E7DF] font-medium text-[#4A2E1F]"
                    : "text-[#765E50] hover:bg-[#FAF7F1]"
                }`
              }
            >
              <Icon size={19} strokeWidth={1.8} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-2 border-t border-[#EAE2D8] p-4">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#4A2E1F] hover:bg-[#FAF7F1]"
          >
            <Store size={19} />
            Back to Store
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-[#765E50] hover:bg-[#FAF7F1]"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
