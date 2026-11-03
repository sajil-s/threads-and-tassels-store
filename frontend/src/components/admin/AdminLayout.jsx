
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, ChevronDown, UserRound } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const displayName =
    user?.fullName || user?.name || "Administrator";

  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#FAF7F1]">
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-h-screen lg:pl-65">
        <header className="sticky top-0 z-30 flex h-19 items-center justify-between border-b border-[#EAE2D8] bg-[#FFFCF8]/95 px-4 backdrop-blur-sm sm:px-8">
          <button
            type="button"
            aria-label="Open admin menu"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-[#4A2E1F] hover:bg-[#FAF7F1] lg:hidden"
          >
            <Menu size={24} />
          </button>

          <div className="hidden font-serif text-lg text-[#4A2E1F] lg:block">
            Store Administration
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8CBB7] text-xs font-semibold text-[#4A2E1F]">
              {initials || <UserRound size={17} />}
            </div>

            <span className="max-w-28 truncate text-sm font-medium text-[#4A2E1F] sm:max-w-40">
              {displayName}
            </span>

            <ChevronDown size={15} className="text-[#765E50]" />
          </div>
        </header>

        <main className="mx-auto max-w-400 px-4 py-7 sm:px-8 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
