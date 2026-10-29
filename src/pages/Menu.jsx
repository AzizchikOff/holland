import { useMemo, useState } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { useLanguage } from "../context/useLanguage.js";
import ProductCard from "../components/ProductCard.jsx";
import { useCart } from "../context/useCart.js";

export default function Menu() {
  const { t, lang } = useLanguage();
  const { products, categories, menuStatus } = useCart();
  const [active, setActive] = useState("all");

  const filtered = useMemo(() => {
    if (active === "all") return products;
    return products.filter((p) => p.category === active);
  }, [active, products]);

  const subtitle = {
    uz: "Holland ta’mlari — har bir lahza uchun.",
    ru: "Вкусы Holland — для каждого момента.",
    en: "Holland flavors — for every moment.",
    tr: "Holland lezzetleri — her an için.",
  };

  const countLabel = {
    uz: "taom",
    ru: "блюд",
    en: "dishes",
    tr: "yemek",
  };

  return (
    <div className="min-h-screen bg-[#EDE2D3] text-[#302824]">
      {/* MENU HERO */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-[#DCC9B3] to-[#EDE2D3]">
        <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full border-[55px] border-[#92272D]/5" />
        <div className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-[#C79B64]/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pt-14 pb-24 sm:px-6 sm:pt-20 sm:pb-32 lg:pt-24 lg:pb-40">
          <div className="flex items-center gap-3 text-[#92272D]">
            <span className="h-[2px] w-9 bg-[#C79B64]" />
            <Sparkles size={15} />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.22em]">
              HOLLAND FOOD COLLECTION
            </span>
          </div>

          <h1 className="mt-6 text-[clamp(2.6rem,6vw,5.5rem)] font-extrabold uppercase leading-none tracking-[-0.065em]">
            MENU
            <span className="text-[#92272D]">.</span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-[#73695E] sm:text-base">
            {subtitle[lang] || subtitle.uz}
          </p>

          <p className="mt-2 max-w-xl text-sm text-[#73695E]">
            {t("choose")}
          </p>
        </div>
      </section>

      {/* CATEGORY FILTERS + PRODUCTS */}
      <section className="relative mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-8 bg-[#C79B64]" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#92272D]">
              HOLLAND SELECTION
            </span>
          </div>

          <span className="rounded-full border border-[#C79B64]/35 bg-white/75 px-4 py-2 text-xs font-bold text-[#73695E]">
            {filtered.length} {countLabel[lang] || countLabel.uz}
          </span>
        </div>

        <div className="cats-scroll flex gap-2 overflow-x-auto border-b border-[#302824]/10 pb-5">
          <button
            type="button"
            onClick={() => setActive("all")}
            aria-pressed={active === "all"}
            className={[
              "relative shrink-0 rounded-full px-5 py-3 text-sm font-bold transition-all duration-300",
              active === "all"
                ? "bg-[#92272D] text-white shadow-md shadow-[#92272D]/15"
                : "border border-[#E4D5C2] bg-white text-[#302824] hover:border-[#C79B64] hover:text-[#92272D]",
            ].join(" ")}
          >
            {t("all")}
          </button>

          {categories.map((category) => (
            <button
              type="button"
              key={category.id}
              onClick={() => setActive(category.id)}
              aria-pressed={active === category.id}
              className={[
                "relative shrink-0 rounded-full px-5 py-3 text-sm font-bold transition-all duration-300",
                active === category.id
                  ? "bg-[#92272D] text-white shadow-md shadow-[#92272D]/15"
                  : "border border-[#E4D5C2] bg-white text-[#302824] hover:border-[#C79B64] hover:text-[#92272D]",
              ].join(" ")}
            >
              {t(`category_${category.id}`)}
            </button>
          ))}
        </div>

        {menuStatus === "fallback" && (
          <div
            role="status"
            className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900"
          >
            {({
              uz: "Menyu serveriga ulanib bo‘lmadi. Buyurtma yuborish vaqtincha cheklangan.",
              ru: "Нет соединения с сервером меню. Оформление заказа временно недоступно.",
              en: "Menu server unavailable. Checkout is temporarily disabled.",
              tr: "Menü sunucusuna ulaşılamıyor. Sipariş geçici olarak devre dışı.",
            })[lang] || "Menyu serveriga ulanib bo‘lmadi."}
          </div>
        )}

        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="min-w-0 transition-transform duration-300 hover:-translate-y-1"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {filtered.length === 0 && menuStatus !== "loading" && (
          <div className="mt-10 rounded-3xl border border-[#C79B64]/25 bg-white px-6 py-16 text-center">
            <Sparkles size={28} className="mx-auto text-[#C79B64]" />
            <p className="mt-4 text-sm text-[#73695E]">{t("loading")}</p>
          </div>
        )}

        <div className="mt-14 flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-[#C79B64]/60" />
          <ArrowUpRight size={17} className="text-[#92272D]" />
          <span className="h-px w-12 bg-[#C79B64]/60" />
        </div>
      </section>
    </div>
  );
}
