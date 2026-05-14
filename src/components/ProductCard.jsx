import { ShoppingCart, Minus, Plus } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { formatSum } from "../lib/money.js";

export default function ProductCard({ product }) {
  const { items, addToCart, setQty } = useCart();
  const cartItem = items[product.id];
  const qty = cartItem?.qty ?? 0;

  return (
    <div className="group relative rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 shadow-xl border-2 border-amber-200 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.03]">
      {/* Issiq ovqat bug'i (STEAM) - doimiy animatsiya */}
      <div className="absolute inset-x-0 top-0 h-32 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full flex items-end justify-center">
          <div className="steam-particle" />
          <div className="steam-particle" />
          <div className="steam-particle" />
          <div className="steam-particle" />
          <div className="steam-particle" />
        </div>
      </div>
      
      {/* Issiqlik porlashi */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="heat-glow" />
      </div>

      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-70 object-cover bg-gradient-to-br from-orange-200 to-yellow-200"
        />
        {product.popular && (
          <div className="absolute top-3 left-3">
            <span className="text-xs font-bold text-red-700 bg-yellow-400/90 px-2 py-1 rounded shadow">
              Mashhur
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="relative p-4 bg-gradient-to-b from-white to-amber-50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-bold text-gray-900 leading-tight text-lg">
              {product.name}
            </h3>
            <p className="mt-1 text-base text-amber-700 font-bold">
              {formatSum(product.price)} so'm
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          {qty === 0 ? (
            <button
              onClick={() => addToCart(product, 1)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 border-2 border-red-500"
            >
              <ShoppingCart size={20} />
              Savatga qo'shish
            </button>
          ) : (
            <div className="w-full flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQty(product.id, qty - 1)}
                  className="w-10 h-10 inline-flex items-center justify-center rounded-xl bg-gray-300 hover:bg-gray-400 transition-colors shadow-md border-2 border-gray-400 font-bold text-gray-800"
                  aria-label="Kamaytirish"
                >
                  <Minus size={20} />
                </button>
                <span className="min-w-8 text-center font-bold text-xl text-gray-900 bg-amber-100 px-2 py-1 rounded-lg">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(product.id, qty + 1)}
                  className="w-10 h-10 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-colors text-white shadow-md border-2 border-green-400 font-bold"
                  aria-label="Ko'paytirish"
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="text-sm text-gray-800 font-semibold">
                Jami:{" "}
                <span className="font-bold text-lg text-red-700">
                  {formatSum(qty * product.price)} so'm
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}