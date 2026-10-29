import { Link } from "react-router-dom";
import { ArrowUpRight, Phone } from "lucide-react";
import { useLanguage } from "../context/useLanguage.js";

const content = {
  uz: {
    tagline: "Tez, halol va mazali fast food.",
    navigation: "Sahifalar",
    contact: "Bog‘lanish",
    rights: "Barcha huquqlar himoyalangan.",
  },
  ru: {
    tagline: "Быстрый, халяльный и вкусный фастфуд.",
    navigation: "Страницы",
    contact: "Контакты",
    rights: "Все права защищены.",
  },
  en: {
    tagline: "Fast, halal and delicious food.",
    navigation: "Pages",
    contact: "Contact",
    rights: "All rights reserved.",
  },
  tr: {
    tagline: "Hızlı, helal ve lezzetli yemekler.",
    navigation: "Sayfalar",
    contact: "İletişim",
    rights: "Tüm hakları saklıdır.",
  },
};

const links = [
  { path: "/", key: "home" },
  { path: "/menu", key: "menu" },
  { path: "/about", key: "about" },
  { path: "/contact", key: "contact" },
];

export default function Footer() {
  const { lang, t } = useLanguage();
  const c = content[lang] || content.uz;

  return (
    <footer className="border-t border-[#C79B64]/30 bg-[#302824] text-[#F7F2EA]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Link to="/" className="text-3xl font-extrabold tracking-tight">
              Holland<span className="text-[#C79B64]">.</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-7 text-white/65">
              {c.tagline}
            </p>
            <span className="mt-5 inline-flex rounded-full border border-[#C79B64]/40 px-3 py-1 text-xs font-bold text-[#C79B64]">
              HALAL
            </span>
          </div>

          <div>
            <h2 className="mb-5 text-sm font-bold uppercase tracking-widest text-[#C79B64]">
              {c.navigation}
            </h2>
            <nav className="grid gap-3">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="group flex w-fit items-center gap-2 text-sm text-white/75 transition-colors hover:text-[#C79B64]"
                >
                  {t(link.key)}
                  <ArrowUpRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="mb-5 text-sm font-bold uppercase tracking-widest text-[#C79B64]">
              {c.contact}
            </h2>
            <a
              href="tel:+998906999595"
              className="inline-flex items-center gap-3 text-sm text-white/80 hover:text-[#C79B64]"
            >
              <Phone size={18} />
              +998 (90) 699 95 95
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-white/15 pt-6 text-xs text-white/50 sm:flex-row">
          <span>© {new Date().getFullYear()} Holland. {c.rights}</span>
          <span>HOLLAND FAST FOOD · NAMANGAN</span>
        </div>
      </div>
    </footer>
  );
}
