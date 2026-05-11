import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Info,
  Menu as MenuIcon,
  Phone,
  ShoppingCart,
  Utensils,
  X,
} from "lucide-react";
import { useCart } from "../context/CartContext.jsx";

const navItems = [
  { path: "/", label: "Bosh sahifa", icon: Home },
  { path: "/menu", label: "Menu", icon: Utensils },
  { path: "/about", label: "Biz haqimizda", icon: Info },
  { path: "/contact", label: "Aloqa", icon: Phone },
];

export default function Navbar() {
  const location = useLocation();
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleNavClick = () => {
    setMobileOpen(false);
  };

  return (
    <>
      <header
        className={[
          "fixed top-0 left-0 right-0 z-50",
          "transition-all duration-300",
          scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white shadow-sm",
        ].join(" ")}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-16 lg:h-20 flex items-center justify-between">
            <Link to="/" className="group flex items-center gap-3">
              <span className="text-2xl font-semibold tracking-tight text-gray-900">
                Holland
              </span>
              <span className="hidden sm:inline-flex px-2.5 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-semibold">
                HALAL
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={[
                      "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                      active
                        ? "bg-red-600 text-white"
                        : "text-gray-700 hover:bg-red-600 hover:text-white",
                    ].join(" ")}
                  >
                    <Icon size={18} strokeWidth={1.8} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <a
                href="tel:+998906999595"
                className="hidden md:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 text-gray-700 hover:bg-red-600 hover:text-white transition-colors text-sm font-medium"
              >
                <Phone size={18} strokeWidth={1.8} />
                +998 (90) 699 95 95
              </a>

              <Link
                to="/order"
                className="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors text-sm font-semibold"
              >
                <ShoppingCart size={18} strokeWidth={1.8} />
                <span className="hidden sm:inline">Savat</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-red-700 text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors"
                aria-label="Mobil menyu"
              >
                {mobileOpen ? (
                  <X size={20} strokeWidth={1.8} />
                ) : (
                  <MenuIcon size={20} strokeWidth={1.8} />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-gray-200 to-transparent" />
      </header>

      {/* Spacer */}
      <div className="h-16 lg:h-20" />

      {/* Mobile overlay */}
      <div
        className={[
          "lg:hidden fixed inset-0 z-40 bg-white transition-all duration-200",
          mobileOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none",
        ].join(" ")}
        style={{ top: "64px" }}
      >
        <div className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={[
                  "flex items-center gap-3 px-4 py-4 rounded-2xl font-medium transition-colors",
                  active
                    ? "bg-red-600 text-white"
                    : "bg-gray-50 text-gray-800 hover:bg-red-600 hover:text-white",
                ].join(" ")}
              >
                <Icon size={22} strokeWidth={1.8} />
                {item.label}
              </Link>
            );
          })}

          <Link
            to="/order"
            onClick={handleNavClick}
            className="mt-3 flex items-center justify-between gap-3 px-4 py-4 rounded-2xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
          >
            <span className="inline-flex items-center gap-3">
              <ShoppingCart size={22} strokeWidth={1.8} />
              Savat
            </span>
            {totalItems > 0 && (
              <span className="bg-yellow-400 text-red-700 text-xs font-bold rounded-full px-2 py-1">
                {totalItems} ta
              </span>
            )}
          </Link>

          <a
            href="tel:+998906999595"
            onClick={handleNavClick}
            className="mt-2 flex items-center justify-between gap-3 px-4 py-4 rounded-2xl bg-gray-50 text-gray-800 hover:bg-red-600 hover:text-white transition-colors"
          >
            <span className="inline-flex items-center gap-3">
              <Phone size={22} strokeWidth={1.8} />
              +998 (90) 699 95 95
            </span>
            <span className="text-sm opacity-75">Qo'ng'iroq →</span>
          </a>
        </div>
      </div>
    </>
  );
}
