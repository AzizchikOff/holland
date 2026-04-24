import { ShoppingCart, Minus, Plus } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { formatSum } from "../lib/money.js";

export default function ProductCard({ product }) {
  const { items, addToCart, setQty } = useCart();
  const cartItem = items[product.id];
  const qty = cartItem?.qty ?? 0;

  return (
    <div className="group rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-70 object-cover bg-gray-50"
        />
        {product.popular && (
          <span className="absolute top-3 left-3 bg-yellow-400 text-red-700 text-xs font-bold px-3 py-1 rounded-full">
            Mashhur
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-gray-900 leading-tight">
              {product.name}
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              {formatSum(product.price)} so‘m
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          {qty === 0 ? (
            <button
              onClick={() => addToCart(product, 1)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-yellow-400 hover:text-red-700 transition-colors"
            >
              <ShoppingCart size={18} />
              Savatga qo‘shish
            </button>
          ) : (
            <div className="w-full flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQty(product.id, qty - 1)}
                  className="w-10 h-10 inline-flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label="Kamaytirish"
                >
                  <Minus size={18} />
                </button>
                <span className="min-w-8 text-center font-semibold">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(product.id, qty + 1)}
                  className="w-10 h-10 inline-flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label="Ko‘paytirish"
                >
                  <Plus size={18} />
                </button>
              </div>

              <div className="text-sm text-gray-600">
                Jami:{" "}
                <span className="font-semibold text-gray-900">
                  {formatSum(qty * product.price)} so‘m
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
