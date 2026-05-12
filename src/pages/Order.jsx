import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { formatSum } from "../lib/money.js";
import { getTelegramDeepLink } from "../config/site.js";

function buildMsg({ name, phone, address, note, itemsArray, totalPrice }) {
  const lines = [
    "🛒 Yangi buyurtma:",
    "",
    `👤 Ism: ${name}`,
    `📞 Telefon: ${phone}`,
    `📍 Manzil: ${address}`,
  ];
  if (note) lines.push(`💬 Izoh: ${note}`);
  lines.push("", "📦 Buyurtma:");
  for (const it of itemsArray) {
    lines.push(`• ${it.product.name} × ${it.qty} = ${formatSum(it.product.price * it.qty)} so'm`);
  }
  lines.push("", `💰 Jami: ${formatSum(totalPrice)} so'm`);
  return lines.join("\n");
}

export default function Order() {
  const { itemsArray, totalItems, totalPrice, setQty, removeFromCart, clearCart } = useCart();
  const [name, setName]       = useState("");
  const [phone, setPhone]     = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote]       = useState("");
  const [error, setError]     = useState("");
  const [copied, setCopied]   = useState(false);
  const [sending, setSending] = useState(false);

  const canSubmit = useMemo(
    () => totalItems > 0 && name.trim() && phone.trim() && address.trim(),
    [name, phone, address, totalItems]
  );

  const msgText = useMemo(
    () => buildMsg({ name: name || "—", phone: phone || "—", address: address || "—", note, itemsArray, totalPrice }),
    [name, phone, address, note, itemsArray, totalPrice]
  );

  const onSubmit = async () => {
    setError("");
    if (totalItems === 0) { setError("Savat bo'sh. Avval mahsulot qo'shing."); return; }
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError("Ism, telefon va manzilni to'ldiring.");
      return;
    }
    setSending(true);
    try {
      // API ga ham yuborish
      const tg = window.Telegram?.WebApp?.initDataUnsafe?.user;
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId:  tg?.id || 0,
          name:    name.trim(),
          phone:   phone.trim(),
          address: address.trim(),
          note:    note.trim(),
          items:   itemsArray.map((it) => ({
            id: it.product.id, name: it.product.name,
            price: it.product.price, qty: it.qty,
          })),
          total: totalPrice,
        }),
      }).catch(() => {});
    } finally {
      setSending(false);
    }
    // Telegramga yo'naltirish
    window.open(getTelegramDeepLink(msgText), "_blank", "noopener,noreferrer");
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(msgText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Nusxa olishda xatolik.");
    }
  };

  // Bo'sh savat
  if (totalItems === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-6xl">🛒</p>
        <h2 className="mt-4 text-xl font-extrabold text-gray-900">Savat bo'sh</h2>
        <p className="mt-2 text-gray-500">Menu'dan mahsulot qo'shing</p>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors"
        >
          🍔 Menu ga o'tish
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 safe-bottom">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">🛒 Buyurtma</h1>
          <p className="mt-1 text-sm text-gray-500">Savatni tekshiring va ma'lumot kiriting</p>
        </div>
        <button
          onClick={clearCart}
          className="text-sm text-red-500 hover:text-red-700 font-semibold px-3 py-1.5 rounded-xl hover:bg-red-50 transition-colors"
        >
          Tozalash
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* ── Savat ── */}
        <div className="rounded-2xl bg-white border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold text-gray-900">Savat</h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {totalItems} ta
            </span>
          </div>

          <div className="space-y-3">
            {itemsArray.map((it) => (
              <div
                key={it.product.id}
                className="flex gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50"
              >
                <img
                  src={it.product.image}
                  alt={it.product.name}
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                  className="w-20 h-16 rounded-xl object-cover bg-gray-200 shrink-0"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-gray-900 text-sm line-clamp-2 leading-tight">
                      {it.product.name}
                    </p>
                    <button
                      onClick={() => removeFromCart(it.product.id)}
                      className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
                      aria-label="O'chirish"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-red-600 font-semibold text-xs mt-0.5">
                    {formatSum(it.product.price)} so'm
                  </p>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setQty(it.product.id, it.qty - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:border-red-300 font-bold text-gray-700 transition-colors"
                      >
                        −
                      </button>
                      <span className="w-6 text-center font-extrabold text-gray-900">
                        {it.qty}
                      </span>
                      <button
                        onClick={() => setQty(it.product.id, it.qty + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-600 text-white hover:bg-red-700 font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      {formatSum(it.qty * it.product.price)} so'm
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Jami */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="font-bold text-gray-700">Umumiy:</span>
            <span className="text-xl font-extrabold text-gray-900">
              {formatSum(totalPrice)} so'm
            </span>
          </div>
        </div>

        {/* ── Forma ── */}
        <div className="rounded-2xl bg-white border border-gray-100 p-5">
          <h2 className="text-lg font-extrabold text-gray-900 mb-1">
            Ma'lumotlarni kiriting
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            Buyurtma Telegram orqali yuboriladi
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Ismingiz *
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Abdulloh Karimov"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Telefon *
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                inputMode="tel"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Manzil *
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ko'cha, uy, mo'ljal..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 text-sm resize-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Izoh (ixtiyoriy)
              </label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Masalan: qo'ng'iroq qilmang..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 text-sm transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm font-semibold">
              ⚠️ {error}
            </div>
          )}

          <div className="mt-5 space-y-2.5">
            <button
              onClick={onSubmit}
              disabled={!canSubmit || sending}
              className={[
                "w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-extrabold text-base transition-all",
                canSubmit && !sending
                  ? "bg-red-600 text-white hover:bg-red-700 active:scale-95 shadow-lg"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed",
              ].join(" ")}
            >
              {sending ? "Yuborilmoqda..." : "📨 Telegramga yuborish"}
            </button>

            <button
              onClick={onCopy}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 active:scale-95 transition-all"
            >
              {copied ? "✅ Nusxa olindi!" : "📋 Matnni nusxa olish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
