


import { useAuth } from "../../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Search,
  UserRound,
  ShoppingCart,
  ChevronRight,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";
import { createPortal } from "react-dom";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Shop All", path: "/products" },
  { label: "Categories", path: "/categories" },
  { label: "About Us", path: "/about" },
  { label: "Contact", path: "/contact" },
];

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { user, isAuthenticated, loading } = useAuth();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  // Lock page scrolling while either overlay is open.
  useEffect(() => {
    if (!isMenuOpen && !isSearchOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen, isSearchOpen]);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function handleSearch(event) {
    event.preventDefault();

    const query = search.trim();

    if (!query) {
      searchInputRef.current?.focus();
      return;
    }

    navigate(`/products?search=${encodeURIComponent(query)}`);

    setSearch("");
    setIsSearchOpen(false);
    setIsMenuOpen(false);
  }

  function toggleSearch() {
    setIsMenuOpen(false);
    setIsSearchOpen((previous) => !previous);
  }

  function handleAccountClick() {
    if (loading) return;

    setIsMenuOpen(false);
    setIsSearchOpen(false);

    if (isAuthenticated) {
      navigate("/account");
    } else {
      navigate("/login", {
        state: { from: "/account" },
      });
    }
  }

  function handleCartClick() {
    if (loading) return;

    setIsMenuOpen(false);
    setIsSearchOpen(false);

    if (isAuthenticated) {
      navigate("/cart");
    } else {
      navigate("/login", {
        state: { from: "/cart" },
      });
    }
  }

  return (
    <>
      <header className="relative z-30 w-full bg-ivory/95 shadow-sm backdrop-blur-md">
        {/* Main Navbar */}
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-2 px-3 sm:h-24 sm:px-6 lg:px-8">
          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => {
              setIsSearchOpen(false);
              setIsMenuOpen(true);
            }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-chocolate transition-colors duration-200 hover:bg-gold/15 hover:text-gold xl:hidden"
          >
            <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          {/* Brand */}
          <Link
            to="/"
            className="min-w-0 text-center lg:text-left"
            aria-label="Threads & Tassels Home"
          >
            <h1 className="whitespace-nowrap font-serif text-[17px] tracking-tight text-chocolate min-[400px]:text-xl sm:text-3xl">
              Threads & Tassels
            </h1>

            <p className="mt-1 whitespace-nowrap text-[5px] uppercase tracking-[0.12em] text-chocolate min-[400px]:text-[7px] sm:text-[10px] sm:tracking-[0.25em]">
              Salwar Materials & Fabrics
            </p>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-5 xl:flex"
          >
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`group relative py-2 text-sm transition-colors duration-200 hover:text-gold ${
                    isActive ? "text-gold" : "text-chocolate"
                  }`}
                >
                  {item.label}

                  <span
                    className={`absolute bottom-0 left-0 h-[2px] rounded-full bg-gold transition-all duration-300 group-hover:w-full ${
                      isActive ? "w-full" : "w-0"
                    }`}
                  />
                </Link>
              );
            })}

            {/* Admin-only dashboard link */}
            {isAdmin && (
              <Link
                to="/admin"
                className="group relative flex items-center gap-1.5 py-2 text-sm font-medium text-chocolate transition-colors duration-200 hover:text-gold"
              >
                <LayoutDashboard size={16} />
                Dashboard

                <span className="absolute bottom-0 left-0 h-[2px] w-0 rounded-full bg-gold transition-all duration-300 group-hover:w-full" />
              </Link>
            )}
          </nav>

          {/* Right Side Icons */}
          <div className="flex shrink-0 items-center gap-1 text-chocolate sm:gap-2">
            {/* Search */}
            <button
              type="button"
              aria-label={isSearchOpen ? "Close search" : "Open search"}
              aria-expanded={isSearchOpen}
              aria-controls="navbar-search"
              onClick={toggleSearch}
              className="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 hover:bg-gold/15 hover:text-gold sm:h-10 sm:w-10"
            >
              {isSearchOpen ? (
                <X className="h-[18px] w-[18px] sm:h-6 sm:w-6" />
              ) : (
                <Search className="h-[18px] w-[18px] sm:h-6 sm:w-6" />
              )}
            </button>

            {/* Account */}
            <button
              type="button"
              aria-label={isAuthenticated ? "My account" : "Log in"}
              onClick={handleAccountClick}
              disabled={loading}
              className="flex h-8 w-8 items-center justify-center rounded-full text-chocolate transition-all duration-200 hover:bg-gold/15 hover:text-gold disabled:cursor-wait disabled:opacity-50 sm:h-10 sm:w-10"
            >
              <UserRound className="h-[18px] w-[18px] sm:h-6 sm:w-6" />
            </button>

            {/* Shopping Cart */}
            <button
              type="button"
              aria-label="Shopping cart"
              onClick={handleCartClick}
              disabled={loading}
              className="relative flex h-8 w-8 items-center justify-center rounded-full text-chocolate transition-all duration-200 hover:bg-gold/15 hover:text-gold disabled:cursor-wait disabled:opacity-50 sm:h-10 sm:w-10"
            >
              <ShoppingCart className="h-[18px] w-[18px] sm:h-6 sm:w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 xl:hidden ${
          isMenuOpen
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0"
        }`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Side Drawer */}
      <aside
        id="mobile-navigation"
        role="dialog"
        aria-modal={isMenuOpen}
        aria-label="Mobile navigation"
        inert={!isMenuOpen}
        className={`fixed inset-y-0 left-0 z-50 flex w-[82%] max-w-[320px] flex-col bg-offwhite shadow-2xl transition-transform duration-300 ease-out xl:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Heading */}
        <div className="flex items-center justify-between border-b border-gold/20 px-6 py-6">
          <div>
            <p className="font-serif text-2xl text-chocolate">
              Explore
            </p>

            <p className="mt-1 text-[10px] uppercase tracking-widest text-sage">
              Threads & Tassels
            </p>
          </div>

          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setIsMenuOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-ivory text-chocolate transition-all duration-200 hover:rotate-90 hover:bg-gold/20 hover:text-gold"
          >
            <X size={21} />
          </button>
        </div>

        {/* Mobile Navigation Links */}
        <nav
          aria-label="Mobile links"
          className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-6"
        >
          {navLinks.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className="group flex items-center justify-between rounded-xl px-4 py-4 text-[15px] font-medium text-chocolate transition-all duration-200 hover:bg-ivory hover:pl-6 hover:text-gold"
            >
              {item.label}

              <ChevronRight
                size={17}
                className="text-gold/60 transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          ))}

          {/* Admin-only mobile link */}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setIsMenuOpen(false)}
              className="group mt-3 flex items-center justify-between rounded-xl border border-gold/20 bg-gold/10 px-4 py-4 text-[15px] font-semibold text-chocolate transition-colors hover:bg-gold/20"
            >
              <span className="flex items-center gap-3">
                <LayoutDashboard size={19} />
                Dashboard
              </span>

              <ChevronRight
                size={17}
                className="text-gold"
              />
            </Link>
          )}
        </nav>

        {/* Drawer Footer */}
        <div className="border-t border-gold/20 bg-ivory px-6 py-6">
          <p className="font-serif text-lg text-chocolate">
            Threads & Tassels
          </p>

          <p className="mt-2 text-xs leading-5 text-sage">
            Elegance woven into every thread.
          </p>
        </div>
      </aside>

      {/* Full Screen Search Overlay */}
      {createPortal(
        <div
          className={`fixed inset-0 z-[100] transition-[visibility] duration-300 ${
            isSearchOpen
              ? "visible"
              : "invisible pointer-events-none"
          }`}
          aria-hidden={!isSearchOpen}
        >
          {/* Blurred Background */}
          <div
            className={`absolute inset-0 bg-[#251A14]/55 backdrop-blur-[5px] transition-opacity duration-300 ${
              isSearchOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setIsSearchOpen(false)}
            aria-hidden="true"
          />

          {/* Search Panel */}
          <div
            id="navbar-search"
            role="dialog"
            aria-modal={isSearchOpen}
            aria-label="Search products"
            inert={!isSearchOpen}
            className={`relative w-full border-b border-gold/20 bg-offwhite shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-all duration-300 ease-out ${
              isSearchOpen
                ? "translate-y-0 opacity-100"
                : "-translate-y-6 opacity-0"
            }`}
          >
            <div className="mx-auto max-w-4xl px-5 pb-8 pt-5 sm:px-8 sm:pb-11 sm:pt-7">
              <div className="mb-7 flex items-center justify-between">
                <div>
                  <p className="font-serif text-xl text-chocolate sm:text-2xl">
                    Threads & Tassels
                  </p>

                  <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-taupe">
                    Find Something Beautiful
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  aria-label="Close search"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-ivory text-chocolate transition-colors hover:bg-gold/20"
                >
                  <X size={21} />
                </button>
              </div>

              {/* Search Form */}
              <form
                onSubmit={handleSearch}
                role="search"
                className="flex items-center gap-3 rounded-xl border border-[#EAE2D8] bg-ivory px-3 py-3 transition-colors focus-within:border-gold sm:px-5"
              >
                <Search size={20} className="shrink-0 text-taupe" />

                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search cotton, silk, fabrics..."
                  aria-label="Search products and categories"
                  tabIndex={isSearchOpen ? 0 : -1}
                  className="min-w-0 flex-1 bg-transparent text-sm text-chocolate outline-none placeholder:text-taupe/70 sm:text-base"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      searchInputRef.current?.focus();
                    }}
                    aria-label="Clear search"
                    className="text-taupe hover:text-chocolate"
                  >
                    <X size={18} />
                  </button>
                )}

                <button
                  type="submit"
                  disabled={!search.trim()}
                  aria-label="Submit search"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-chocolate text-white transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowRight size={19} />
                </button>
              </form>

              <p className="mt-4 text-center text-[11px] text-taupe">
                Explore our beautiful collection of salwar materials
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

export default Navbar;
