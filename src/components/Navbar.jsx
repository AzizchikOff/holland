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
          scrolled ? "bg-[#F8F5EF]/95 backdrop-blur-md shadow-sm" : "bg-[#F8F5EF] shadow-sm",
        ].join(" ")}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-16 lg:h-20 flex items-center justify-between">
            <Link to="/" className="group flex items-center gap-3">
              <span className="text-2xl font-semibold tracking-tight text-[#171719]">
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
                        ? "bg-[#A91F23] text-white"
                        : "text-gray-700 hover:bg-[#A91F23] hover:text-white",
                    ].join(" ")}
                  >
                    <Icon size={18} strokeWidth={1.8} />
                    {t(item.label)}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <select aria-label="Til / Language" value={lang} onChange={(e)=>setLang(e.target.value)} className="rounded-lg border border-gray-200 bg-white p-2 text-sm font-semibold"><option value="uz">UZ</option><option value="ru">RU</option><option value="en">EN</option><option value="tr">TR</option></select>
              <a
                href="tel:+998906999595"
                className="hidden md:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 text-gray-700 hover:bg-[#A91F23] hover:text-white transition-colors text-sm font-medium"
              >
                <Phone size={18} strokeWidth={1.8} />
                +998 (90) 699 95 95
              </a>

              <Link
                to="/order"
                className="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#A91F23] text-white hover:bg-[#8D191D] transition-colors text-sm font-semibold"
              >
                <ShoppingCart size={18} strokeWidth={1.8} />
                <span className="hidden sm:inline">{t("cart")}</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#D8A65A] text-[#171719] text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[#A91F23] text-white hover:bg-[#8D191D] transition-colors"
                aria-label={mobileOpen ? "Menyuni yopish" : t("menu")}
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
          "lg:hidden fixed inset-x-0 bottom-0 top-16 z-40",
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
        <div id="holland-mobile-menu" className={[
          "absolute right-0 top-0 bottom-0 w-[min(88vw,360px)]",
          "overflow-y-auto bg-[#F8F5EF] shadow-2xl",
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
                to={item.path}
                onClick={handleNavClick}
                className={[
                  "flex items-center gap-3 px-4 py-4 rounded-2xl font-medium transition-colors",
                  active
                    ? "bg-[#A91F23] text-white"
                    : "bg-gray-50 text-gray-800 hover:bg-[#A91F23] hover:text-white",
                ].join(" ")}
              >
                <Icon size={22} strokeWidth={1.8} />
                {t(item.label)}
              </Link>
            );
          })}

          <Link
            to="/order"
            onClick={handleNavClick}
            className="mt-3 flex items-center justify-between gap-3 px-4 py-4 rounded-2xl bg-[#A91F23] text-white font-semibold hover:bg-[#8D191D] transition-colors"
          >
            <span className="inline-flex items-center gap-3">
              <ShoppingCart size={22} strokeWidth={1.8} />
              {t("cart")}
            </span>
            {totalItems > 0 && (
              <span className="bg-[#D8A65A] text-[#171719] text-xs font-bold rounded-full px-2 py-1">
                {totalItems} ta
              </span>
            )}
          </Link>

          <a
            href="tel:+998906999595"
            onClick={handleNavClick}
            className="mt-2 flex items-center justify-between gap-3 px-4 py-4 rounded-2xl bg-gray-50 text-gray-800 hover:bg-[#A91F23] hover:text-white transition-colors"
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