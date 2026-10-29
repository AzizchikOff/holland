import { useEffect, useRef, useState } from "react";
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
import { useLanguage } from "../context/useLanguage.js";
import { useCart } from "../context/useCart.js";

const navItems = [
  { path: "/", label: "home", icon: Home },
  { path: "/menu", label: "menu", icon: Utensils },
  { path: "/about", label: "about", icon: Info },
  { path: "/contact", label: "contact", icon: Phone },
];

export default function Navbar() {
  const location = useLocation();
  const {lang,setLang,t}=useLanguage();
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const drawerRef = useRef(null);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const drawer = drawerRef.current;
    const previousFocus = document.activeElement;

    const getFocusable = () =>
      Array.from(
        drawer?.querySelectorAll(
          'a[href], button:not([disabled]), select:not([disabled])'
        ) ?? []
      );

    getFocusable()[0]?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const elements = getFocusable();
      if (!elements.length) return;

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);

      if (previousFocus?.isConnected) {
        previousFocus.focus();
      }
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isMiniApp = location.pathname === "/app" ||
    location.pathname.startsWith("/app/");

  const appPath = (path) => {
    if (!isMiniApp) return path;
    return path === "/" ? "/app" : `/app${path}`;
  };

  const isActive = (path) => location.pathname === appPath(path);

  const handleNavClick = () => {
    setMobileOpen(false);
  };

  return (
    <>
      <header
        className={[
          "fixed top-0 left-0 right-0 z-50 border-b border-[#C79B64]/35",
          "transition-all duration-300",
          scrolled ? "bg-[#EDE2D3]/95 backdrop-blur-xl shadow-[0_8px_30px_rgba(48,40,36,0.09)]" : "bg-[#EDE2D3] shadow-sm",
        ].join(" ")}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-16 lg:h-20 grid grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-[1fr_auto_1fr] items-center gap-1.5 sm:gap-3">
            <Link to={appPath("/")} className="group flex min-w-0 items-center gap-2">
              <span className="truncate text-lg min-[380px]:text-xl sm:text-2xl font-semibold tracking-tight text-[#302824]">
                Holland
              </span>
              <span className="hidden sm:inline-flex px-2.5 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-semibold">
                HALAL
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center justify-center gap-1 justify-self-center">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={appPath(item.path)}
                    className={[
                      "group relative flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-300",
                      active
                        ? "text-[#92272D]"
                        : "text-[#302824] hover:text-[#92272D]",
                    ].join(" ")}
                  >
                    <Icon size={18} strokeWidth={1.8} />
                    {t(item.label)}
                    <span
                      aria-hidden="true"
                      className={[
                        "absolute bottom-0 left-3 right-3 h-[2.5px] origin-center rounded-full bg-[#C79B64]",
                        "transition-transform duration-300 ease-out",
                        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                      ].join(" ")}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-1 sm:gap-2 justify-self-end">
              <select aria-label="Til / Language" value={lang} onChange={(e)=>setLang(e.target.value)} className="w-[55px] sm:w-auto rounded-xl border border-[#C79B64]/35 bg-white px-1 sm:px-2 py-2.5 text-xs sm:text-sm font-bold text-[#302824] outline-none focus-visible:ring-2 focus-visible:ring-[#C79B64]"><option value="uz">UZ</option><option value="ru">RU</option><option value="en">EN</option><option value="tr">TR</option></select>
              <a
                href="tel:+998906999595"
                className="hidden md:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F5E9D9] text-gray-700 hover:bg-[#92272D] hover:text-white transition-colors text-sm font-medium"
              >
                <Phone size={18} strokeWidth={1.8} />
                +998 (90) 699 95 95
              </a>

              <Link
                to={appPath("/order")}
                className="relative inline-flex shrink-0 items-center justify-center gap-2 w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2.5 rounded-xl bg-[#92272D] text-white hover:bg-[#781D23] transition-colors text-sm font-semibold"
              >
                <ShoppingCart size={18} strokeWidth={1.8} />
                <span className="hidden sm:inline">{t("cart")}</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#C79B64] text-[#302824] text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="lg:hidden inline-flex shrink-0 items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#92272D] text-white hover:bg-[#781D23] transition-colors"
                aria-label={mobileOpen ? "Menyuni yopish" : t("menu")}
                ref={menuButtonRef}
                aria-expanded={mobileOpen}
                aria-controls="holland-mobile-menu"
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
          "lg:hidden fixed inset-x-0 bottom-0 top-16 z-40 overflow-hidden",
          "transition-[visibility] duration-300",
          mobileOpen ? "visible" : "invisible pointer-events-none",
        ].join(" ")}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          tabIndex={mobileOpen ? 0 : -1}
          aria-label="Menyuni yopish"
          onClick={() => setMobileOpen(false)}
          className={[
            "absolute inset-0 w-full bg-[#171719]/45 backdrop-blur-sm",
            "transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />
        <div ref={drawerRef} id="holland-mobile-menu" className={[
          "absolute right-0 top-0 bottom-0 w-[min(88vw,360px)]",
          "overflow-y-auto bg-[#EDE2D3] shadow-2xl",
          "transition-transform duration-300 ease-out",
          mobileOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}>
        <div className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={appPath(item.path)}
                onClick={handleNavClick}
                className={[
                  "flex items-center gap-3 px-4 py-4 rounded-2xl font-medium transition-colors",
                  active
                    ? "bg-[#92272D] text-white"
                    : "bg-[#F5E9D9] text-gray-800 hover:bg-[#92272D] hover:text-white",
                ].join(" ")}
              >
                <Icon size={22} strokeWidth={1.8} />
                {t(item.label)}
              </Link>
            );
          })}

          <Link
            to={appPath("/order")}
            onClick={handleNavClick}
            className="mt-3 flex items-center justify-between gap-3 px-4 py-4 rounded-2xl bg-[#92272D] text-white font-semibold hover:bg-[#781D23] transition-colors"
          >
            <span className="inline-flex items-center gap-3">
              <ShoppingCart size={22} strokeWidth={1.8} />
              {t("cart")}
            </span>
            {totalItems > 0 && (
              <span className="bg-[#C79B64] text-[#302824] text-xs font-bold rounded-full px-2 py-1">
                {totalItems} ta
              </span>
            )}
          </Link>

          <a
            href="tel:+998906999595"
            onClick={handleNavClick}
            className="mt-2 flex items-center justify-between gap-3 px-4 py-4 rounded-2xl bg-[#F5E9D9] text-gray-800 hover:bg-[#92272D] hover:text-white transition-colors"
          >
            <span className="inline-flex items-center gap-3">
              <Phone size={22} strokeWidth={1.8} />
              +998 (90) 699 95 95
            </span>
            <span className="text-sm opacity-75">{t("call")} →</span>
          </a>
        </div>
        </div>
      </div>
    </>
  );
}