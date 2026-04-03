import { useMemo, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { formatSum } from "../lib/money.js";
import { getTelegramDeepLink } from "../config/site.js";

function buildTelegramMessage({ name, phone, address, itemsArray, totalPrice }) {
  const lines = [];
  lines.push("Yangi buyurtma:");
  lines.push(`Ism: ${name}`);
  lines.push(`Telefon: ${phone}`);
  lines.push(`Manzil: ${address}`);
  lines.push("");
  lines.push("Buyurtma:");
  if (!itemsArray.length) lines.push("- (bo'sh)");
  else for (const it of itemsArray) lines.push(`- ${it.product.name} x${it.qty}`);
  lines.push("");
  lines.push(`Jami: ${formatSum(totalPrice)} so'm`);
  return lines.join("\n");
}

export default function Order() {
  const { itemsArray, totalItems, totalPrice, setQty, removeFromCart, clearCart } =
    useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => {
    if (totalItems === 0) return false;
    if (!name.trim() || !phone.trim() || !address.trim()) return false;
    return true;
  }, [name, phone, address, totalItems]);

  const telegramText = useMemo(
    () =>
      buildTelegramMessage({
        name: name.trim() || "—",
        phone: phone.trim() || "—",
        address: address.trim() || "—",
        itemsArray,
        totalPrice,
      }),
    [name, phone, address, itemsArray, totalPrice],
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (totalItems === 0) {
      setError("Savat bo‘sh. Avval mahsulot qo'shing.");
      return;
    }
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError("Iltimos, ism/telefon/manzil maydonlarini to'ldiring.");
      return;
    }

    const link = getTelegramDeepLink(telegramText);
    window.open(link, "_blank", "noopener,noreferrer");
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(telegramText);
    } catch {
      setError("Nusxa olishda xatolik. Matnni qo'lda belgilang.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Buyurtma
          </h1>
          <p className="mt-2 text-gray-600">
            Savatni tekshiring va ma'lumotlarni kiriting.
          </p>
        </div>
        {totalItems > 0 && (
          <button
            onClick={clearCart}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors font-semibold text-sm"
          >
            Savatni tozalash
          </button>
        )}
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cart */}
        <div className="rounded-2xl bg-white border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Savat</h2>
            <div className="text-sm text-gray-600">
              {totalItems} ta mahsulot
            </div>
          </div>

          {itemsArray.length === 0 ? (
            <div className="mt-8 rounded-2xl bg-gray-50 p-6 text-gray-700">
              Savat bo‘sh. Menu sahifasidan mahsulot qo'shing.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {itemsArray.map((it) => (
                <div
                  key={it.product.id}
                  className="flex gap-4 rounded-2xl border border-gray-100 p-4"
                >
                  <img
                    src={it.product.image}
                    alt={it.product.name}
                    className="w-24 h-20 rounded-xl object-cover bg-gray-50"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 truncate">
                          {it.product.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatSum(it.product.price)} so'm
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(it.product.id)}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700"
                        aria-label="O'chirish"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setQty(it.product.id, it.qty - 1)}
                          className="w-10 h-10 inline-flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                          aria-label="Kamaytirish"
                        >
                          <Minus size={18} />
                        </button>
                        <span className="min-w-8 text-center font-semibold">
                          {it.qty}
                        </span>
                        <button
                          onClick={() => setQty(it.product.id, it.qty + 1)}
                          className="w-10 h-10 inline-flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                          aria-label="Ko'paytirish"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                      <div className="text-sm text-gray-600">
                        Jami:{" "}
                        <span className="font-semibold text-gray-900">
                          {formatSum(it.qty * it.product.price)} so'm
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="text-gray-700 font-semibold">Umumiy</div>
                <div className="text-xl font-extrabold text-gray-900">
                  {formatSum(totalPrice)} so'm
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form */}
        <div className="rounded-2xl bg-white border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900">
            Buyurtma ma'lumotlari
          </h2>
          <p className="mt-2 text-gray-600">
            Buyurtma Telegram orqali yuboriladi.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">Ism</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600"
                placeholder="Ismingiz"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Telefon
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-2 w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600"
                placeholder="+998 90 123 45 67"
                inputMode="tel"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Manzil
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-2 w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 min-h-28"
                placeholder="Tuman, ko'cha, uy, mo'ljal..."
              />
            </div>

            {error && (
              <div className="rounded-2xl bg-red-50 text-red-700 px-4 py-3 text-sm font-semibold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className={[
                "w-full inline-flex items-center justify-center px-6 py-3.5 rounded-2xl font-bold transition-colors",
                canSubmit
                  ? "bg-red-600 text-white hover:bg-yellow-400 hover:text-red-800"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed",
              ].join(" ")}
            >
              Telegramga yuborish →
            </button>

            <button
              type="button"
              onClick={onCopy}
              className="w-full inline-flex items-center justify-center px-6 py-3 rounded-2xl font-semibold bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              Buyurtma matnini nusxa olish
            </button>

            <details className="rounded-2xl bg-gray-50 p-4">
              <summary className="cursor-pointer font-semibold text-gray-800">
                Telegramga yuboriladigan matn (ko'rish)
              </summary>
              <pre className="mt-3 text-sm whitespace-pre-wrap text-gray-700">
                {telegramText}
              </pre>
            </details>
          </form>
        </div>
      </div>
    </div>
  );
}
