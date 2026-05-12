import { useCart } from "../context/CartContext.jsx";
import { formatSum } from "../lib/money.js";

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='200' y='155' font-size='48' text-anchor='middle'%3E🍔%3C/text%3E%3C/svg%3E";

export default function ProductCard({ product }) {
  const { items, addToCart, setQty } = useCart();
  const cartItem = items[product.id];
  const qty = cartItem?.qty ?? 0;

  return (
    <div className="group relative rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">

      {/* Rasm */}
      <div className="relative overflow-hidden bg-gray-50">
        {/* Steam effekti faqat popular mahsulotlarda */}
        {product.popular && (
          <div className="absolute inset-x-0 top-0 h-24 overflow-hidden pointer-events-none z-10">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full flex items-end justify-center">
              <div className="steam-particle" />
              <div className="steam-particle" />
              <div className="steam-particle" />
              <div className="steam-particle" />
              <div className="steam-particle" />
            </div>
          </div>
        )}

        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="heat-glow" />
        </div>

        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Mashhur badge */}
        {product.popular && (
          <div className="absolute top-2 left-2 z-20">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-yellow-400 px-2 py-1 rounded-lg shadow-sm">
              🔥 Hit
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-5" />
      </div>

      {/* Kontent */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 leading-tight line-clamp-2">
          {product.name}
        </h3>
        <p className="mt-1 text-red-600 font-extrabold text-lg">
          {formatSum(product.price)} so'm
        </p>

        <div className="mt-auto pt-3">
          {qty === 0 ? (
            <button
              onClick={() => addToCart(product, 1)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-sm transition-all duration-150 shadow-sm"
            >
              🛒 Savatga qo'shish
            </button>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQty(product.id, qty - 1)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all font-bold text-gray-800 text-lg"
                  aria-label="Kamaytirish"
                >
                  −
                </button>
                <span className="min-w-7 text-center font-extrabold text-gray-900 text-lg">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(product.id, qty + 1)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 transition-all text-white font-bold text-lg"
                  aria-label="Ko'paytirish"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-gray-500 font-semibold">
                {formatSum(qty * product.price)} so'm
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
