import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

const NAV = [
  { path: "/",        label: "Bosh sahifa", icon: "🏠" },
  { path: "/menu",    label: "Menu",         icon: "🍔" },
  { path: "/about",   label: "Biz haqimizda",icon: "ℹ️" },
  { path: "/contact", label: "Aloqa",        icon: "📞" },
];

export default function Navbar() {
  const location = useLocation();
  const { totalItems } = useCart();
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const prevItems = useRef(totalItems);
  const [badgePop, setBadgePop]     = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Savat o'zgarganda badge animatsiyasi
  useEffect(() => {
    if (totalItems !== prevItems.current) {
      setBadgePop(true);
      const t = setTimeout(() => setBadgePop(false), 400);
      prevItems.current = totalItems;
      return () => clearTimeout(t);
    }
  }, [totalItems]);

  // Menyu ochilganda body scroll ni bloklash
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isActive = (p) => location.pathname === p;
  const close    = () => setMobileOpen(false);

  return (
    <>
      <header
        className={[
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur-sm shadow-md"
            : "bg-white shadow-sm",
        ].join(" ")}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-16 flex items-center justify-between gap-4">

            {/* Logo */}
            <Link
              to="/"
              onClick={close}
              className="flex items-center gap-2 shrink-0"
            >
              <span className="text-2xl font-extrabold tracking-tight text-gray-900">
                Holland
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-lg bg-green-100 text-green-700 text-xs font-bold">
                HALAL
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {NAV.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={[
                    "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
                    isActive(path)
                      ? "bg-red-600 text-white shadow-sm"
                      : "text-gray-700 hover:bg-red-50 hover:text-red-600",
                  ].join(" ")}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2 shrink-0">
              <a
                href="tel:+998906999595"
                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 text-gray-700 hover:bg-red-600 hover:text-white transition-colors text-sm font-semibold"
              >
                📞 <span>+998 90 699 95 95</span>
              </a>

              {/* Savat tugmasi */}
              <Link
                to="/order"
                className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors text-sm font-bold shadow-sm"
              >
                🛒
                <span className="hidden sm:inline">Savat</span>
                {totalItems > 0 && (
                  <span
                    className={[
                      "absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 flex items-center justify-center",
                      "bg-yellow-400 text-red-700 text-[11px] font-extrabold rounded-full",
                      badgePop ? "badge-pop" : "",
                    ].join(" ")}
                  >
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Mobil burger */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors text-xl"
                aria-label="Menyu"
              >
                {mobileOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </header>

      {/* Spacer */}
      <div className="h-16" />

      {/* Mobil overlay */}
      <div
        className={[
          "lg:hidden fixed inset-0 z-40 bg-white transition-all duration-250",
          mobileOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none",
        ].join(" ")}
        style={{ top: 64 }}
      >
        <div className="p-4 space-y-2 overflow-y-auto h-full safe-bottom">
          {NAV.map(({ path, label, icon }) => (
            <Link
              key={path}
              to={path}
              onClick={close}
              className={[
                "flex items-center gap-3 px-4 py-4 rounded-2xl font-semibold text-base transition-colors",
                isActive(path)
                  ? "bg-red-600 text-white"
                  : "bg-gray-50 text-gray-800 hover:bg-red-50 hover:text-red-600",
              ].join(" ")}
            >
              <span className="text-xl">{icon}</span>
              {label}
            </Link>
          ))}

          <Link
            to="/order"
            onClick={close}
            className="flex items-center justify-between px-4 py-4 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors"
          >
            <span className="flex items-center gap-3">
              <span className="text-xl">🛒</span>
              Savat
            </span>
            {totalItems > 0 && (
              <span className="bg-yellow-400 text-red-700 text-sm font-extrabold rounded-full px-3 py-0.5">
                {totalItems} ta
              </span>
            )}
          </Link>

          <a
            href="tel:+998906999595"
            onClick={close}
            className="flex items-center justify-between px-4 py-4 rounded-2xl bg-gray-50 text-gray-800 hover:bg-gray-100 transition-colors"
          >
            <span className="flex items-center gap-3 font-semibold">
              <span className="text-xl">📞</span>
              +998 (90) 699 95 95
            </span>
            <span className="text-sm text-gray-500">Qo'ng'iroq →</span>
          </a>
        </div>
      </div>
    </>
  );
}
