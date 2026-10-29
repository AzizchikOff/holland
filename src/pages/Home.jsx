import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { useCart } from "../context/useCart.js";
import { useLanguage } from "../context/useLanguage.js";
import ProductCard from "../components/ProductCard.jsx";
const formatSum = (price) =>
  `${new Intl.NumberFormat("uz-UZ").format(Number(price) || 0)} so'm`;

const copy = {
  uz: {
    eyebrow: "FRESH. BOLD. HOLLAND.",
    headline1: "MAZALI LAHZALAR",
    headline2: "HOLLAND BILAN BOSHLANADI.",
    description: "Sevimli taomlaringiz, o‘zgacha ta’m va yangi energiya. Har bir luqma — alohida zavq.",
    menu: "Menyuni ko‘rish",
    order: "Buyurtma berish",
    featured: "TANLANGAN TAOM",
    next: "Keyingi taom",
    previous: "Oldingi taom",
    popular: "ENG SEVIMLI TAOMLAR",
    popularDesc: "Siz sevgan Holland taomlari — bir joyda.",
    all: "Barcha taomlar",
    about: "HOLLAND — BU TA’M",
    aboutDesc: "Bizning maqsadimiz oddiy: mazali taom, qulay buyurtma va yoqimli tajriba.",
    learn: "Biz haqimizda",
    ready: "MAZALI LAHZALAR SHU YERDAN BOSHLANADI",
    readyDesc: "Sevimli taomingizni tanlang va buyurtma bering.",
    apiWarning: "Menu serveriga ulanib bo‘lmadi. Buyurtma yuborish vaqtincha cheklangan.",
  },
  ru: {
    eyebrow: "FRESH. BOLD. HOLLAND.",
    headline1: "ВКУСНЫЕ МОМЕНТЫ",
    headline2: "НАЧИНАЮТСЯ С HOLLAND.",
    description: "Любимые блюда, яркий вкус и новая энергия. Каждый кусочек — особенное удовольствие.",
    menu: "Смотреть меню",
    order: "Заказать",
    featured: "ВЫБОР HOLLAND",
    next: "Следующее блюдо",
    previous: "Предыдущее блюдо",
    popular: "ЛЮБИМЫЕ БЛЮДА",
    popularDesc: "Ваши любимые блюда Holland — в одном месте.",
    all: "Все блюда",
    about: "HOLLAND — ЭТО ВКУС",
    aboutDesc: "Наша цель проста: вкусная еда, удобный заказ и приятные впечатления.",
    learn: "О нас",
    ready: "ВКУСНЫЕ МОМЕНТЫ НАЧИНАЮТСЯ ЗДЕСЬ",
    readyDesc: "Выберите любимое блюдо и оформите заказ.",
    apiWarning: "Не удалось подключиться к меню. Оформление заказа временно недоступно.",
  },
  en: {
    eyebrow: "FRESH. BOLD. HOLLAND.",
    headline1: "GREAT MOMENTS",
    headline2: "START WITH HOLLAND.",
    description: "Your favorites, bold flavors and fresh energy. Every bite is an experience.",
    menu: "Explore menu",
    order: "Order now",
    featured: "HOLLAND'S PICK",
    next: "Next dish",
    previous: "Previous dish",
    popular: "THE FAN FAVORITES",
    popularDesc: "Your favorite Holland dishes, all in one place.",
    all: "All dishes",
    about: "HOLLAND IS ABOUT FLAVOR",
    aboutDesc: "Our goal is simple: great food, easy ordering and a memorable experience.",
    learn: "About us",
    ready: "GREAT MOMENTS START HERE",
    readyDesc: "Choose your favorite and place an order.",
    apiWarning: "Menu server unavailable. Ordering is temporarily disabled.",
  },
  tr: {
    eyebrow: "FRESH. BOLD. HOLLAND.",
    headline1: "LEZZETLİ ANLAR",
    headline2: "HOLLAND İLE BAŞLAR.",
    description: "Favori lezzetleriniz, cesur tatlar ve taze enerji. Her lokma ayrı bir keyif.",
    menu: "Menüyü keşfet",
    order: "Sipariş ver",
    featured: "HOLLAND SEÇİMİ",
    next: "Sonraki yemek",
    previous: "Önceki yemek",
    popular: "EN SEVİLENLER",
    popularDesc: "Sevdiğiniz Holland lezzetleri bir arada.",
    all: "Tüm yemekler",
    about: "HOLLAND LEZZET DEMEK",
    aboutDesc: "Amacımız basit: lezzetli yemekler, kolay sipariş ve güzel bir deneyim.",
    learn: "Hakkımızda",
    ready: "LEZZETLİ ANLAR BURADA BAŞLAR",
    readyDesc: "Favori yemeğinizi seçin ve sipariş verin.",
    apiWarning: "Menü sunucusuna ulaşılamıyor. Sipariş geçici olarak devre dışı.",
  },
};

export default function Home() {
  const { products, menuStatus } = useCart();
  const languageContext = useLanguage();

  const lang = languageContext.language || languageContext.lang || "uz";
  const c = copy[lang] || copy.uz;

  const available = products.filter((p) => p.available !== false);
  const popular = available.filter((p) => p.popular).slice(0, 4);
  const featured = popular.length ? popular : available.slice(0, 4);

  const [activeIndex, setActiveIndex] = useState(0);
  const safeIndex = featured.length
    ? activeIndex % featured.length
    : 0;

  const activeProduct = featured[safeIndex];

  const move = (direction) => {
    if (featured.length < 2) return;
    setActiveIndex((current) =>
      (current + direction + featured.length) % featured.length
    );
  };

  return (
    <div className="overflow-hidden bg-[#EDE2D3] text-[#302824]">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-[#DCC9B3]">
        <div className="pointer-events-none absolute -right-32 -top-40 h-[480px] w-[480px] rounded-full bg-[#D5C2AC]/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-52 -left-36 h-[420px] w-[420px] rounded-full bg-[#92272D]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-10 sm:px-6 sm:pb-20 sm:pt-16 lg:pt-20">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#302824]/15 pb-5">
            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#92272D] sm:text-xs">
              <Sparkles size={15} />
              {c.eyebrow}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#776C61] sm:text-xs">
              EST. NAMANGAN
            </span>
          </div>

          <div className="grid items-center gap-8 pt-9 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12 lg:pt-14">
            <div className="relative z-10">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#92272D]/20 bg-white/50 px-4 py-2 text-xs font-bold text-[#92272D]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#92272D]" />
                HOLLAND SIGNATURE
              </div>

              <h1 className="max-w-[780px] text-[clamp(2.5rem,5.6vw,5.5rem)] font-black uppercase leading-[0.88] tracking-[-0.075em]">
                <span className="block">{c.headline1}</span>
                <span className="mt-3 block text-[#92272D]">
                  {c.headline2}
                </span>
              </h1>

              <p className="mt-7 max-w-md text-sm leading-7 text-[#655F58] sm:text-base">
                {c.description}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/menu"
                  className="group inline-flex min-h-13 items-center justify-center gap-3 rounded-full bg-[#92272D] px-7 py-3 font-bold text-white shadow-lg shadow-[#92272D]/15 transition-all duration-300 hover:-translate-y-1 hover:bg-[#781D23]"
                >
                  {c.menu}
                  <ArrowUpRight
                    size={19}
                    className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </Link>

                <Link
                  to="/order"
                  className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-[#302824]/20 px-6 py-3 font-semibold transition-colors hover:bg-white/60"
                >
                  <ShoppingBag size={18} />
                  {c.order}
                </Link>
              </div>

              <div className="mt-10 flex items-center gap-3 border-t border-[#302824]/15 pt-5 text-xs font-semibold text-[#73695E]">
                <ShieldCheck size={17} className="text-[#92272D]" />
                <span>HOLLAND · FRESH · HALAL</span>
              </div>
            </div>

            {/* FEATURED PRODUCT */}
            <div className="relative flex min-h-[390px] items-center justify-center sm:min-h-[490px]">
              <div className="pointer-events-none absolute inset-x-[10%] top-[12%] aspect-square rounded-full bg-[#D9C3A8]/60" />
              <div className="pointer-events-none absolute inset-x-[20%] top-[22%] aspect-square rounded-full border border-white/70" />
              <div className="pointer-events-none absolute inset-x-[5%] top-[6%] aspect-square rounded-full border border-[#92272D]/10" />

              <span className="pointer-events-none absolute left-0 top-6 -rotate-12 text-5xl font-black tracking-[-0.07em] text-[#92272D]/10 sm:text-7xl">
                FRESH
              </span>

              {activeProduct ? (
                <div
                  key={activeProduct.id}
                  className="relative z-10 w-full max-w-[470px] animate-[hollandReveal_450ms_ease-out] px-5"
                >
                  <div className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/55 p-5 shadow-[0_30px_90px_rgba(72,45,29,0.13)] backdrop-blur-sm sm:p-7">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#92272D]">
                        {c.featured}
                      </span>
                      <span className="rounded-full bg-[#302824] px-3 py-1 text-[10px] font-bold text-white">
                        {String(safeIndex + 1).padStart(2, "0")} /{" "}
                        {String(featured.length).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="mt-4 flex h-[220px] items-center justify-center overflow-hidden rounded-[1.8rem] bg-[#FBF8F3] sm:h-[290px]">
                      {activeProduct.image ? (
                        <img
                          src={activeProduct.image}
                          alt={activeProduct.name}
                          className="h-full w-full object-contain p-3 transition-transform duration-500 hover:scale-110"
                          fetchPriority="high"
                        />
                      ) : (
                        <ShoppingBag size={64} className="text-[#C9B6A1]" />
                      )}
                    </div>

                    <div className="mt-5 flex items-end justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="truncate text-lg font-black sm:text-xl">
                          {activeProduct.name}
                        </h2>
                        <p className="mt-1 text-base font-extrabold text-[#92272D]">
                          {formatSum(activeProduct.price)}
                        </p>
                      </div>

                      <Link
                        to="/menu"
                        aria-label={c.menu}
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#92272D] text-white transition-transform hover:scale-110"
                      >
                        <ArrowUpRight size={22} />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative z-10 flex h-64 w-64 items-center justify-center rounded-full bg-white/50">
                  <ShoppingBag size={64} className="text-[#92272D]/30" />
                </div>
              )}

              {featured.length > 1 && (
                <div className="absolute bottom-0 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/70 bg-white/80 p-2 shadow-lg backdrop-blur-md">
                  <button
                    type="button"
                    onClick={() => move(-1)}
                    aria-label={c.previous}
                    className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[#F0E5D9]"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div className="flex gap-1.5">
                    {featured.map((p, i) => (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => setActiveIndex(i)}
                        aria-label={`${c.featured} ${i + 1}`}
                        aria-current={i === safeIndex ? "true" : undefined}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          i === safeIndex
                            ? "w-7 bg-[#92272D]"
                            : "w-2 bg-[#302824]/20"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => move(1)}
                    aria-label={c.next}
                    className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[#F0E5D9]"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>


      {/* POPULAR — PREMIUM PRODUCT SHOWCASE */}
      <section className="relative isolate overflow-hidden bg-[#EDE2D3] py-16 sm:py-24 lg:py-28">
        <div className="pointer-events-none absolute -right-32 top-8 h-96 w-96 rounded-full bg-[#D9C3A8]/25 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-[#92272D]/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 flex flex-col gap-6 border-b border-[#302824]/10 pb-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-5 flex items-center gap-3">
                <span className="h-[2px] w-10 bg-[#C79B64]" />
                <span className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#92272D]">
                  HOLLAND SELECTION
                </span>
              </div>

              <h2 className="max-w-xl text-[clamp(2rem,4.5vw,4.5rem)] font-black uppercase leading-[1.02] tracking-[-0.06em] text-[#302824]">
                {c.popular}
              </h2>

              <p className="mt-4 max-w-md text-sm leading-7 text-[#776B61] sm:text-base">
                {c.popularDesc}
              </p>
            </div>

            <Link
              to="/menu"
              className="group inline-flex w-fit items-center gap-3 rounded-full border border-[#C79B64]/60 bg-white/75 px-6 py-3.5 text-sm font-extrabold text-[#302824] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#92272D] hover:text-[#92272D]"
            >
              {c.all}
              <ArrowUpRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </div>

          {menuStatus === "fallback" && (
            <div className="mb-7 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {c.apiWarning}
            </div>
          )}

          <div className="relative rounded-[2rem] border border-[#C79B64]/20 bg-[#E3D3C0]/55 p-3 shadow-[0_20px_70px_rgba(48,40,36,0.05)] sm:p-6 lg:p-8">
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#C79B64]/60 to-transparent" />

            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {featured.map((product) => (
                <div
                  key={product.id}
                  className="min-w-0 transition-transform duration-300 hover:-translate-y-1.5"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-9 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-[#C79B64]/60" />
            <span className="h-2 w-2 rotate-45 bg-[#C79B64]" />
            <span className="h-px w-12 bg-[#C79B64]/60" />
          </div>
        </div>
      </section>


      {/* HOLLAND — SINGLE PREMIUM BRAND BANNER */}
      <section className="bg-[#EDE2D3] pb-0 pt-4 sm:pt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#92272D] via-[#75262C] to-[#302824] text-white sm:rounded-[3rem]">

            <div className="pointer-events-none absolute -right-36 -top-40 h-[540px] w-[540px] rounded-full border-[75px] border-white/[0.055]" />
            <div className="pointer-events-none absolute -bottom-44 left-1/3 h-96 w-96 rounded-full bg-[#C79B64]/10 blur-3xl" />

            <div className="relative grid items-center gap-8 px-6 py-12 sm:px-12 sm:py-14 lg:grid-cols-[1.35fr_0.65fr] lg:gap-10 lg:px-16 lg:py-16">
              <div className="relative z-10">
                <div className="mb-6 flex items-center gap-3">
                  <span className="h-[2px] w-10 bg-[#C79B64]" />
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#E8C08C]">
                    THE HOLLAND EXPERIENCE
                  </span>
                </div>

                <h2 className="max-w-3xl font-[Manrope] text-[clamp(1.85rem,3.3vw,3.5rem)] font-bold leading-[1.15] tracking-[-0.045em]">
                  <span className="block text-[#E8C08C]">HOLLAND —</span>
                  <span className="mt-3 block">{c.ready}</span>
                </h2>

                <p className="mt-7 max-w-xl text-sm leading-8 text-white/75 sm:text-base">
                  {c.readyDesc}
                </p>

                <div className="mt-9 flex flex-wrap gap-3">
                  <Link
                    to="/menu"
                    className="group inline-flex items-center gap-3 rounded-full bg-[#C79B64] px-7 py-4 text-sm font-black text-[#302824] transition-all duration-300 hover:-translate-y-1 hover:bg-[#E2B779]"
                  >
                    {c.menu}
                    <ArrowRight size={19} className="transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    to="/about"
                    className="group inline-flex items-center gap-3 rounded-full border border-white/35 bg-white/10 px-7 py-4 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-[#92272D]"
                  >
                    {c.learn}
                    <ArrowUpRight size={19} />
                  </Link>
                </div>
              </div>

              <div className="relative flex min-h-[220px] items-center justify-center sm:min-h-[300px]">
                <div className="absolute h-64 w-64 rounded-full border border-[#C79B64]/25 sm:h-80 sm:w-80" />
                <div className="absolute h-48 w-48 rounded-full border border-[#C79B64]/40 sm:h-60 sm:w-60" />

                <div className="relative flex h-44 w-44 -rotate-12 flex-col items-center justify-center rounded-full border border-[#C79B64]/60 bg-[#92272D]/60 text-center shadow-2xl transition-transform duration-500 hover:rotate-0 sm:h-56 sm:w-56">
                  <span className="text-[10px] font-black tracking-[0.3em] text-[#E8C08C]">
                    FRESH
                  </span>
                  <span className="mt-3 text-3xl font-black tracking-[-0.07em] sm:text-4xl">
                    HOLLAND
                  </span>
                  <span className="mt-3 text-[10px] font-black tracking-[0.3em] text-[#E8C08C]">
                    FAST FOOD
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-10 bg-[#EDE2D3] sm:h-14" />
      </section>

    </div>
  );
}
