import { useMemo, useState, useRef } from "react";
import { Minus, Plus, Trash2, Navigation, PenLine, MapPin, CheckCircle2, Loader2, ChevronDown, Banknote, CreditCard } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { formatSum } from "../lib/money.js";
import { getTelegramDeepLink } from "../config/site.js";

// ── Davlat kodlari ──────────────────────────────────────────
const COUNTRIES = [
  { code: "+998", flag: "🇺🇿", name: "O'zbekiston" },
  { code: "+7",   flag: "🇷🇺", name: "Rossiya"     },
  { code: "+7",   flag: "🇰🇿", name: "Qozog'iston" },
  { code: "+996", flag: "🇰🇬", name: "Qirg'iziston" },
  { code: "+992", flag: "🇹🇯", name: "Tojikiston"  },
  { code: "+993", flag: "🇹🇲", name: "Turkmaniston" },
  { code: "+994", flag: "🇦🇿", name: "Ozarbayjon"  },
  { code: "+90",  flag: "🇹🇷", name: "Turkiya"     },
  { code: "+971", flag: "🇦🇪", name: "BAA"         },
  { code: "+1",   flag: "🇺🇸", name: "USA"         },
];

// ── Telefon input ────────────────────────────────────────────
function PhoneInput({ value, onChange }) {
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [open, setOpen]       = useState(false);
  const dropRef               = useRef(null);

  const handleSelect = (c) => {
    setCountry(c);
    setOpen(false);
    onChange("");
  };

  return (
    <div className="mt-2 flex rounded-2xl border-2 border-gray-200 focus-within:border-red-500 overflow-hidden transition-colors bg-white">
      {/* Davlat kodi */}
      <div className="relative flex-shrink-0" ref={dropRef}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 px-3 py-3 h-full bg-gray-50 hover:bg-gray-100 border-r-2 border-gray-200 transition-colors font-bold text-sm"
        >
          <span className="text-lg leading-none">{country.flag}</span>
          <span className="text-gray-700 text-sm">{country.code}</span>
          <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="absolute top-full left-0 z-50 mt-1 w-52 bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
            {COUNTRIES.map((c, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelect(c)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                  c.code === country.code && c.flag === country.flag ? "bg-red-50 font-bold text-red-700" : "text-gray-700 font-medium"
                }`}
              >
                <span className="text-lg">{c.flag}</span>
                <span className="flex-1 text-left">{c.name}</span>
                <span className="text-gray-400">{c.code}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Raqam */}
      <input
        type="tel"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^\d\s\-()]/g, ""))}
        className="flex-1 px-4 py-3 outline-none text-sm font-medium bg-white placeholder-gray-400"
        placeholder="90 123 45 67"
      />
    </div>
  );
}

// ── GPS hook ─────────────────────────────────────────────────
function useGPS() {
  const [status, setStatus]     = useState("idle");
  const [coords, setCoords]     = useState(null);
  const [gpsLabel, setGpsLabel] = useState("");

  const detect = async () => {
    if (!navigator.geolocation) { setStatus("error"); return; }
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setCoords({ lat, lng });
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=uz`
          );
          const d = await r.json();
          setGpsLabel(d.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        } catch {
          setGpsLabel(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        }
        setStatus("success");
      },
      () => setStatus("error"),
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const reset = () => { setStatus("idle"); setCoords(null); setGpsLabel(""); };

  return { status, coords, gpsLabel, detect, reset };
}

// ── Manzil komponenti ────────────────────────────────────────
function AddressField({ address, onAddress, onGps }) {
  const [mode, setMode]             = useState("none"); // none | gps | manual
  const { status, coords, gpsLabel, detect, reset } = useGPS();

  const pickGPS = async () => {
    setMode("gps");
    await detect();
  };

  // GPS muvaffaqiyatli bo'lganda address va gps ni yangilash
  useMemo(() => {
    if (status === "success" && gpsLabel) {
      onAddress(gpsLabel);
      onGps(coords);
    }
  }, [status, gpsLabel]);

  const goBack = () => {
    setMode("none");
    reset();
    onAddress("");
    onGps(null);
  };

  if (mode === "none") return (
    <div className="grid grid-cols-2 gap-3 mt-2">
      <button type="button" onClick={pickGPS}
        className="flex flex-col items-center gap-2.5 p-5 rounded-2xl border-2 border-blue-100 bg-blue-50 hover:border-blue-400 hover:bg-blue-100 transition-all group active:scale-95">
        <div className="w-11 h-11 rounded-xl bg-blue-500 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
          <Navigation size={22} className="text-white" />
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-gray-900">GPS orqali</div>
          <div className="text-xs text-gray-500 mt-0.5">Avtomatik aniqlash</div>
        </div>
      </button>

      <button type="button" onClick={() => setMode("manual")}
        className="flex flex-col items-center gap-2.5 p-5 rounded-2xl border-2 border-green-100 bg-green-50 hover:border-green-400 hover:bg-green-100 transition-all group active:scale-95">
        <div className="w-11 h-11 rounded-xl bg-green-500 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
          <PenLine size={22} className="text-white" />
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-gray-900">Qo'lda kiritish</div>
          <div className="text-xs text-gray-500 mt-0.5">Ko'cha, uy, mo'ljal</div>
        </div>
      </button>
    </div>
  );

  if (mode === "gps") {
    if (status === "loading") return (
      <div className="mt-2 flex items-center gap-3 p-4 rounded-2xl bg-blue-50 border-2 border-blue-200">
        <Loader2 size={20} className="text-blue-500 animate-spin flex-shrink-0" />
        <div>
          <div className="text-sm font-bold text-blue-800">Joylashuv aniqlanmoqda...</div>
          <div className="text-xs text-blue-600 mt-0.5">Bir necha sekund kuting</div>
        </div>
      </div>
    );

    if (status === "error") return (
      <div className="mt-2 flex flex-col gap-3">
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 border-2 border-red-200">
          <span className="text-xl flex-shrink-0">⚠️</span>
          <div>
            <div className="text-sm font-bold text-red-800">GPS ruxsat berilmadi</div>
            <div className="text-xs text-red-600 mt-0.5">Brauzer sozlamalaridan ruxsat bering yoki qo'lda kiriting</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={goBack}
            className="flex-1 py-2.5 rounded-xl bg-gray-100 text-sm font-semibold hover:bg-gray-200 transition-colors">← Ortga</button>
          <button type="button" onClick={() => { reset(); setMode("manual"); }}
            className="flex-1 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors">Qo'lda kiritish</button>
        </div>
      </div>
    );

    if (status === "success") return (
      <div className="mt-2 flex flex-col gap-2">
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-green-50 border-2 border-green-400">
          <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-green-800 mb-1">Manzil aniqlandi ✅</div>
            <div className="text-xs text-green-700 leading-relaxed break-words">{gpsLabel}</div>
          </div>
        </div>
        {coords && (
          <a href={`https://maps.google.com/?q=${coords.lat},${coords.lng}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-semibold hover:underline">
            <MapPin size={12} />Xaritada ko'rish
          </a>
        )}
        <div className="flex gap-2 mt-1">
          <button type="button" onClick={goBack}
            className="flex-1 py-2.5 rounded-xl bg-gray-100 text-sm font-semibold hover:bg-gray-200 transition-colors">← Qayta aniqlash</button>
          <button type="button" onClick={() => { reset(); setMode("manual"); onGps(null); }}
            className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold hover:bg-gray-50 transition-colors">Qo'lda o'zgartirish</button>
        </div>
      </div>
    );
  }

  if (mode === "manual") return (
    <div className="mt-2 flex flex-col gap-2">
      <textarea
        value={address}
        onChange={(e) => onAddress(e.target.value)}
        autoFocus
        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-red-500 min-h-28 text-sm font-medium resize-none transition-colors"
        placeholder="Tuman, ko'cha, uy raqami, mo'ljal..."
      />
      <button type="button" onClick={goBack}
        className="self-start text-xs text-gray-500 font-semibold hover:text-gray-700 transition-colors">
        ← Ortga
      </button>
    </div>
  );
}

// ── Backend API ──────────────────────────────────────────────
// Render'dagi bot/backend manzili — server.js shu joyda ishlaydi
const API_URL = "https://holland-bot.onrender.com";

// Buyurtmani MongoDB'ga saqlash (statistika va hisobotlar uchun)
async function saveOrderToBackend({ name, phone, address, gps, itemsArray, totalPrice, paymentMethod }) {
  try {
    await fetch(`${API_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: 0,
        name, phone, address,
        gps: gps || null,
        items: itemsArray.map((it) => ({
          name: it.product.name,
          price: it.product.price,
          qty: it.qty,
        })),
        total: totalPrice,
        paymentMethod,
        source: "website",
      }),
    });
  } catch {
    // Backend bilan bog'lanib bo'lmasa ham Telegram'ga yuborish davom etadi
  }
}

// ── Telegram xabari ──────────────────────────────────────────
function buildTelegramMessage({ name, phone, address, gps, itemsArray, totalPrice, paymentMethod }) {
  const lines = [];
  lines.push("🛎 Yangi buyurtma:");
  lines.push(`👤 Ism: ${name}`);
  lines.push(`📞 Telefon: ${phone}`);
  lines.push(`📍 Manzil: ${address}`);
  if (gps) lines.push(`🗺 Xarita: https://maps.google.com/?q=${gps.lat},${gps.lng}`);
  lines.push(`💳 To'lov turi: ${paymentMethod === "card" ? "Karta 💳" : "Naqd 💵"}`);
  lines.push("");
  lines.push("📦 Buyurtma:");
  if (!itemsArray.length) lines.push("- (bo'sh)");
  else for (const it of itemsArray)
    lines.push(`- ${it.product.name} x${it.qty} = ${formatSum(it.qty * it.product.price)} so'm`);
  lines.push("");
  lines.push(`💰 Jami: ${formatSum(totalPrice)} so'm`);
  return lines.join("\n");
}

// ── Asosiy Order ─────────────────────────────────────────────
export default function Order() {
  const { itemsArray, totalItems, totalPrice, setQty, removeFromCart, clearCart } = useCart();
  const [name, setName]       = useState("");
  const [phone, setPhone]     = useState("");
  const [address, setAddress] = useState("");
  const [gps, setGps]         = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [error, setError]       = useState("");
  const [sending, setSending]   = useState(false);

  const canSubmit = useMemo(() =>
    totalItems > 0 && name.trim() && phone.trim() && address.trim() && !sending,
    [name, phone, address, totalItems, sending]
  );

  const telegramText = useMemo(() =>
    buildTelegramMessage({ name: name.trim() || "—", phone: phone.trim() || "—",
      address: address.trim() || "—", gps, itemsArray, totalPrice, paymentMethod }),
    [name, phone, address, gps, itemsArray, totalPrice, paymentMethod]
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (totalItems === 0) { setError("Savat bo'sh. Avval mahsulot qo'shing."); return; }
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError("Iltimos, barcha maydonlarni to'ldiring."); return;
    }

    setSending(true);
    // Avval buyurtmani bazaga saqlaymiz (statistika va Excel hisobot uchun)
    await saveOrderToBackend({
      name: name.trim(), phone: phone.trim(), address: address.trim(),
      gps, itemsArray, totalPrice, paymentMethod,
    });
    setSending(false);

    // Keyin Telegramga yuboramiz
    window.open(getTelegramDeepLink(telegramText), "_blank", "noopener,noreferrer");
  };

  const onCopy = async () => {
    try { await navigator.clipboard.writeText(telegramText); }
    catch { setError("Nusxa olishda xatolik."); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">Buyurtma</h1>
          <p className="mt-2 text-gray-600">Savatni tekshiring va ma'lumotlarni kiriting.</p>
        </div>
        {totalItems > 0 && (
          <button onClick={clearCart}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors font-semibold text-sm">
            Savatni tozalash
          </button>
        )}
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Savat ── */}
        <div className="rounded-2xl bg-white border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Savat</h2>
            <div className="text-sm text-gray-600">{totalItems} ta mahsulot</div>
          </div>

          {itemsArray.length === 0 ? (
            <div className="rounded-2xl bg-gray-50 p-6 text-gray-700 text-sm">
              Savat bo'sh. Menu sahifasidan mahsulot qo'shing.
            </div>
          ) : (
            <div className="space-y-4">
              {itemsArray.map((it) => (
                <div key={it.product.id} className="flex gap-4 rounded-2xl border border-gray-100 p-4">
                  <img src={it.product.image} alt={it.product.name}
                    className="w-24 h-20 rounded-xl object-cover bg-gray-50" loading="lazy"/>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 truncate text-sm">{it.product.name}</div>
                        <div className="text-sm text-gray-500">{formatSum(it.product.price)} so'm</div>
                      </div>
                      <button onClick={() => removeFromCart(it.product.id)}
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-red-50 hover:text-red-600 transition-colors flex-shrink-0">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setQty(it.product.id, it.qty - 1)}
                          className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
                          <Minus size={16} />
                        </button>
                        <span className="min-w-7 text-center font-bold">{it.qty}</span>
                        <button onClick={() => setQty(it.product.id, it.qty + 1)}
                          className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors">
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {formatSum(it.qty * it.product.price)} so'm
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="font-semibold text-gray-700">Umumiy</div>
                <div className="text-xl font-extrabold text-gray-900">{formatSum(totalPrice)} so'm</div>
              </div>
            </div>
          )}
        </div>

        {/* ── Forma ── */}
        <div className="rounded-2xl bg-white border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900">Buyurtma ma'lumotlari</h2>
          <p className="mt-1 text-sm text-gray-500">Buyurtma Telegram orqali yuboriladi.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-5">
            {/* Ism */}
            <div>
              <label className="text-sm font-semibold text-gray-700">👤 Ism</label>
              <input value={name} onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-red-500 transition-colors font-medium text-sm"
                placeholder="To'liq ismingiz"/>
            </div>

            {/* Telefon — davlat kodi bilan */}
            <div>
              <label className="text-sm font-semibold text-gray-700">📞 Telefon</label>
              <PhoneInput value={phone} onChange={setPhone} />
            </div>

            {/* Manzil — GPS yoki qo'lda */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block">📍 Manzil</label>
              <AddressField address={address} onAddress={setAddress} onGps={setGps} />
            </div>

            {/* To'lov turi */}
            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                <CreditCard size={16} className="text-gray-500" /> To'lov turi
              </label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cash")}
                  className={`flex items-center justify-center gap-2.5 py-3 rounded-2xl border-2 transition-all font-semibold text-sm active:scale-95 ${
                    paymentMethod === "cash"
                      ? "border-red-500 bg-red-50 text-red-700 font-bold"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 font-medium"
                  }`}
                >
                  <Banknote size={18} className={paymentMethod === "cash" ? "text-red-700" : "text-gray-500"} /> Naqd
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`flex items-center justify-center gap-2.5 py-3 rounded-2xl border-2 transition-all font-semibold text-sm active:scale-95 ${
                    paymentMethod === "card"
                      ? "border-red-500 bg-red-50 text-red-700 font-bold"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 font-medium"
                  }`}
                >
                  <CreditCard size={18} className={paymentMethod === "card" ? "text-red-700" : "text-gray-500"} /> Karta
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm font-semibold">
                ⚠️ {error}
              </div>
            )}

            <button type="submit" disabled={!canSubmit}
              className={[
                "w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-base transition-all",
                canSubmit
                  ? "bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-lg hover:shadow-red-200 active:scale-98"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed",
              ].join(" ")}>
              {sending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Yuborilmoqda...
                </>
              ) : (
                "Telegramga yuborish →"
              )}
            </button>

            <button type="button" onClick={onCopy}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200">
              📋 Matnni nusxa olish
            </button>

            <details className="rounded-2xl bg-gray-50 p-4 border border-gray-100">
              <summary className="cursor-pointer font-semibold text-gray-800 text-sm select-none">
                📄 Yuboriladigan matn
              </summary>
              <pre className="mt-3 text-xs whitespace-pre-wrap text-gray-600 font-mono leading-relaxed">{telegramText}</pre>
            </details>
          </form>
        </div>
      </div>
    </div>
  );
}