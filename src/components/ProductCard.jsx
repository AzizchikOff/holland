import { createPortal } from "react-dom";
import { useLanguage } from "../context/useLanguage.js";
import { useEffect, useState } from "react";
import { ShoppingCart, Minus, Plus, Star } from "lucide-react";
import { useCart } from "../context/useCart.js";
import { formatSum } from "../lib/money.js";

// ✅ FIX 4: Steam faqat issiq kategoriyalarda — 190 emas, ~60 animatsiya


export default function ProductCard({ product }) {
  const { t } = useLanguage();
  const [detailsOpen, setDetailsOpen] = useState(false);
  useEffect(() => {
    if (!detailsOpen) return;
    const close = (event) => { if (event.key === "Escape") setDetailsOpen(false); };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [detailsOpen]);
  const { items, addToCart, setQty } = useCart();
  const qty    = items[product.id]?.qty ?? 0;
  const descriptionKey = {free:"descriptionFree",burger:"descriptionBurger",hotdog:"descriptionHotdog",sous:"descriptionSous",drink:"descriptionDrink"}[product.category];
  const inCart = qty > 0;

  return (
    <div className={[
      "product-card group relative flex flex-col rounded-2xl overflow-hidden bg-white transition-all duration-300",
      "border hover:-translate-y-1",
      inCart ? "border-red-300 shadow-lg shadow-red-100/60" : "border-gray-100 shadow-sm hover:shadow-xl",
    ].join(" ")}>

      <div className="relative overflow-hidden">

        <button type="button" onClick={() => setDetailsOpen(true)} aria-label={`${product.name} — ${t("details")}`} className="block w-full text-left cursor-pointer">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width="400"
          height="300"
          decoding="async"
          className="w-full aspect-[4/3] object-cover bg-gray-50 transition-transform duration-500 group-hover:scale-105"
        />
        </button>

        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.popular && (
            <span className="inline-flex items-center gap-1 bg-yellow-400 text-red-800 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              <Star size={11} /> {t("hit")}
            </span>
          )}

        </div>

        {inCart && (
          <div className="absolute top-3 right-3 z-10 w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
            {qty}
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <button type="button" onClick={() => setDetailsOpen(true)} className="font-bold text-gray-900 leading-snug text-[15px] text-left hover:text-red-600 focus-visible:outline-2 focus-visible:outline-red-600">{product.name}</button>
          <span className="mt-1 block text-red-600 font-extrabold">{formatSum(product.price)} {t("currency")}</span>
        </div>

        <button type="button" onClick={() => setDetailsOpen(true)} className="text-left text-xs font-semibold text-red-600 hover:underline">{t("details")} →</button>
        <div className="mt-auto">
          {qty === 0 ? (
            <button onClick={() => addToCart(product, 1)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-red-600 text-white hover:bg-red-700 active:scale-95 transition-all shadow-sm">
              <ShoppingCart size={16} /> {t("add")}
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-1.5">
                <button onClick={() => setQty(product.id, qty - 1)}
                  className="w-9 h-9 inline-flex items-center justify-center rounded-lg bg-white shadow-sm hover:bg-red-50 hover:text-red-600 transition-colors active:scale-95">
                  <Minus size={16} />
                </button>
                <span className="font-extrabold text-gray-900 min-w-8 text-center">{qty}</span>
                <button onClick={() => setQty(product.id, qty + 1)}
                  className="w-9 h-9 inline-flex items-center justify-center rounded-lg bg-red-600 text-white shadow-sm hover:bg-red-700 transition-colors active:scale-95">
                  <Plus size={16} />
                </button>
              </div>
              <div className="text-center text-xs text-gray-500 font-medium">
                {t("total")}: <span className="font-bold text-gray-900">{formatSum(qty * product.price)} {t("currency")}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      {detailsOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) setDetailsOpen(false); }}>
          <section role="dialog" aria-modal="true" aria-label={`${product.name} — ${t("details")}`} className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="relative">
              <img src={product.image} alt={product.name} className="w-full h-56 object-cover" />
              <button type="button" autoFocus onClick={() => setDetailsOpen(false)} aria-label={t("close")} className="absolute right-3 top-3 rounded-full bg-white px-3 py-2 font-bold shadow">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <h2 className="text-2xl font-extrabold text-gray-900">{product.name}</h2>
              <p className="text-xl font-extrabold text-red-600">{formatSum(product.price)} {t("currency")}</p>
              <div><h3 className="font-bold mb-1">{t("description")}</h3><p className="text-gray-600">{descriptionKey ? `${product.name} — ${t(descriptionKey)}` : product.description}</p></div>
              <div><h3 className="font-bold mb-1">{t("ingredients")}</h3><p className="text-gray-600">{Array.isArray(product.ingredients) && product.ingredients.length ? product.ingredients.join(", ") : t("pending")}</p></div>
              <p className="text-xs text-gray-500">{t("allergy")}</p>
              <button type="button" onClick={() => { addToCart(product, 1); setDetailsOpen(false); }} className="w-full rounded-xl bg-red-600 py-3 font-bold text-white hover:bg-red-700">{t("add")}</button>
            </div>
          </section>
        </div>, document.body
      )}
    </div>
  );
}