import { ShoppingCart, Minus, Plus, Flame } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { formatSum } from "../lib/money.js";

// ✅ FIX 4: Steam faqat issiq kategoriyalarda — 190 emas, ~60 animatsiya
const HOT_CATEGORIES = ["free", "burger", "hotdog"];

export default function ProductCard({ product }) {
  const { items, addToCart, setQty } = useCart();
  const qty    = items[product.id]?.qty ?? 0;
  const isHot  = HOT_CATEGORIES.includes(product.category);
  const inCart = qty > 0;

  return (
    <div className={[
      "product-card group relative flex flex-col rounded-2xl overflow-hidden bg-white transition-all duration-300",
      "border hover:-translate-y-1",
      inCart ? "border-red-300 shadow-lg shadow-red-100/60" : "border-gray-100 shadow-sm hover:shadow-xl",
    ].join(" ")}>

      <div className="relative overflow-hidden">
        {/* ✅ Steam faqat issiq taomlarda */}
        {isHot && (
          <div className="steam-wrap" aria-hidden="true">
            <span className="steam s1" /><span className="steam s2" /><span className="steam s3" />
          </div>
        )}

        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width="400"
          height="300"
          decoding="async"
          className="w-full aspect-[4/3] object-cover bg-gray-50 transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.popular && (
            <span className="inline-flex items-center gap-1 bg-yellow-400 text-red-800 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              <Flame size={11} /> Hit
            </span>
          )}
          {isHot && (
            <span className="bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              🔥 Issiq
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
          <h3 className="font-bold text-gray-900 leading-snug text-[15px]">{product.name}</h3>
          <span className="mt-1 block text-red-600 font-extrabold">{formatSum(product.price)} so'm</span>
        </div>

        <div className="mt-auto">
          {qty === 0 ? (
            <button onClick={() => addToCart(product, 1)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-red-600 text-white hover:bg-red-700 active:scale-95 transition-all shadow-sm">
              <ShoppingCart size={16} /> Savatga qo'shish
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
                Jami: <span className="font-bold text-gray-900">{formatSum(qty * product.price)} so'm</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}