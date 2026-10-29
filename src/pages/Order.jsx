import { useEffect, useMemo, useState, useRef } from "react";
import { Minus, Plus, Trash2, Navigation, PenLine, MapPin, CheckCircle2, Loader2, ChevronDown, Banknote, CreditCard } from "lucide-react";
import { useCart } from "../context/useCart.js";
import { formatSum } from "../lib/money.js";
import { getTelegramDeepLink } from "../config/site.js";
import { useLanguage } from "../context/useLanguage.js";
import { getOrderTranslations } from "../lib/orderTranslations.js";


const API_URL = import.meta.env.VITE_API_URL || "https://holland-bot.onrender.com";

// ── Davlat kodlari ──────────────────────────────────────────
const COUNTRIES = [
  { code: "+998", flag: "🇺🇿", name: "O'zbekiston" },
  { code: "+7",   flag: "🇷🇺", name: "Rossiya"      },
  { code: "+7",   flag: "🇰🇿", name: "Qozog'iston"  },
  { code: "+996", flag: "🇰🇬", name: "Qirg'iziston"  },
  { code: "+992", flag: "🇹🇯", name: "Tojikiston"   },
  { code: "+993", flag: "🇹🇲", name: "Turkmaniston"  },
  { code: "+994", flag: "🇦🇿", name: "Ozarbayjon"   },
  { code: "+90",  flag: "🇹🇷", name: "Turkiya"      },
  { code: "+971", flag: "🇦🇪", name: "BAA"           },
  { code: "+1",   flag: "🇺🇸", name: "USA"           },
];

// ── Telefon input ──────────────────────────────────────────
// ✅ FIX 2a: country.code + value birlashtirilib yuboriladi
function PhoneInput({ value, onChange, onFullPhone }) {
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [open, setOpen]       = useState(false);
  const dropRef               = useRef(null);

  // Tashqariga bosilganda yopish
  // ✅ FIX 2f: dropRef ishlatiladi
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleSelect = (c) => {
    setCountry(c);
    setOpen(false);
    onChange("");
    onFullPhone(c.code + "");
  };

  const handleChange = (e) => {
    const num = e.target.value.replace(/[^\d\s\-()]/g, "");
    onChange(num);
    // ✅ To'liq telefon = davlat kodi + raqam
    onFullPhone((country.code + num).replace(/\s/g, ""));
  };

  return (
    <div className="mt-2 flex rounded-2xl border-2 border-gray-200 focus-within:border-[#92272D] focus-within:ring-0 focus-within:shadow-none overflow-visible transition-colors bg-white">
      <div className="relative flex-shrink-0" ref={dropRef}>
        <button type="button" onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 px-3 py-3 h-full bg-gray-50 hover:bg-gray-100 border-r-2 border-gray-200 transition-colors font-bold text-sm rounded-l-2xl">
          <span className="text-lg leading-none">{country.flag}</span>
          <span className="text-gray-700 text-sm">{country.code}</span>
          <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
          <div className="absolute top-full left-0 z-50 mt-1 w-52 bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
            {COUNTRIES.map((c, i) => (
              <button key={i} type="button" onClick={() => handleSelect(c)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                  c.code === country.code && c.flag === country.flag ? "bg-red-50 font-bold text-red-700" : "text-gray-700 font-medium"
                }`}>
                <span className="text-lg">{c.flag}</span>
                <span className="flex-1 text-left">{c.name}</span>
                <span className="text-gray-400">{c.code}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <input type="tel" inputMode="numeric" value={value} onChange={handleChange}
        className="min-w-0 flex-1 px-3 sm:px-4 py-3 outline-none focus:outline-none focus:ring-0 focus:shadow-none text-sm font-medium bg-transparent placeholder-gray-400 rounded-r-2xl"
        placeholder="90 123 45 67"/>
    </div>
  );
}

// ── GPS hook ────────────────────────────────────────────────
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
          const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=uz`);
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

// ── Manzil komponenti ───────────────────────────────────────
function AddressField({ address, onAddress, onGps }) {
  const { lang } = useLanguage();
  const c = getOrderTranslations(lang);
  const [mode, setMode] = useState("none");
  const { status, coords, gpsLabel, detect, reset } = useGPS();

  // ✅ FIX 2e: useMemo o'rniga useEffect (side-effect uchun)
  useEffect(() => {
    if (status === "success" && gpsLabel) {
      onAddress(gpsLabel);
      onGps(coords);
    }
  }, [status, gpsLabel, coords, onAddress, onGps]);

  const goBack = () => { setMode("none"); reset(); onAddress(""); onGps(null); };

  if (mode === "none") return (
    <div className="grid grid-cols-2 gap-3 mt-2">
      <button type="button" onClick={() => { setMode("gps"); detect(); }}
        className="flex flex-col items-center gap-2.5 p-5 rounded-2xl border-2 border-[#C79B64]/40 bg-[#F5E9D9] hover:border-[#C79B64] hover:bg-[#EAD8C2] transition-all group active:scale-95">
        <div className="w-11 h-11 rounded-xl bg-[#C79B64] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
          <Navigation size={22} className="text-white" />
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-gray-900">{c.gps}</div>
          <div className="text-xs text-gray-500 mt-0.5">{c.gpsHint}</div>
        </div>
      </button>
      <button type="button" onClick={() => setMode("manual")}
        className="flex flex-col items-center gap-2.5 p-5 rounded-2xl border-2 border-[#92272D]/20 bg-[#F3E6E2] hover:border-[#92272D] hover:bg-[#EBD5D0] transition-all group active:scale-95">
        <div className="w-11 h-11 rounded-xl bg-[#92272D] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
          <PenLine size={22} className="text-white" />
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-gray-900">{c.manual}</div>
          <div className="text-xs text-gray-500 mt-0.5">{c.manualHint}</div>
        </div>
      </button>
    </div>
  );

  if (mode === "gps") {
    if (status === "loading") return (
      <div className="mt-2 flex items-center gap-3 p-4 rounded-2xl bg-blue-50 border-2 border-blue-200">
        <Loader2 size={20} className="text-blue-500 animate-spin flex-shrink-0" />
        <div>
          <div className="text-sm font-bold text-blue-800">{c.detecting}</div>
          <div className="text-xs text-blue-600 mt-0.5">{c.wait}</div>
        </div>
      </div>
    );
    if (status === "error") return (
      <div className="mt-2 flex flex-col gap-3">
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 border-2 border-red-200">
          <span className="text-xl flex-shrink-0">⚠️</span>
          <div>
            <div className="text-sm font-bold text-red-800">{c.gpsError}</div>
            <div className="text-xs text-red-600 mt-0.5">{c.gpsErrorHint}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={goBack} className="flex-1 py-2.5 rounded-xl bg-gray-100 text-sm font-semibold hover:bg-gray-200 transition-colors">{`← ${c.back}`}</button>
          <button type="button" onClick={() => { reset(); setMode("manual"); }} className="flex-1 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors">{c.manual}</button>
        </div>
      </div>
    );
    if (status === "success") return (
      <div className="mt-2 flex flex-col gap-2">
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-green-50 border-2 border-green-400">
          <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-green-800 mb-1">{c.gpsSuccess} ✅</div>
            <div className="text-xs text-green-700 leading-relaxed break-words">{gpsLabel}</div>
          </div>
        </div>
        {coords && (
          <a href={`https://maps.google.com/?q=${coords.lat},${coords.lng}`} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-semibold hover:underline">
            <MapPin size={12} />Xaritada ko'rish
          </a>
        )}
        <div className="flex gap-2 mt-1">
          <button type="button" onClick={goBack} className="flex-1 py-2.5 rounded-xl bg-gray-100 text-sm font-semibold hover:bg-gray-200 transition-colors">{`← ${c.retry}`}</button>
          <button type="button" onClick={() => { reset(); setMode("manual"); onGps(null); }} className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold hover:bg-gray-50 transition-colors">{c.editManual}</button>
        </div>
      </div>
    );
  }

  if (mode === "manual") return (
    <div className="mt-2 flex flex-col gap-2">
      <textarea value={address} onChange={(e) => onAddress(e.target.value)} autoFocus
        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:outline-none focus:ring-0 focus:shadow-none focus:border-[#92272D] min-h-28 text-sm font-medium resize-none transition-colors"
        placeholder={c.addressPlaceholder} />
      <button type="button" onClick={goBack} className="self-start text-xs text-gray-500 font-semibold hover:text-gray-700 transition-colors">{`← ${c.back}`}</button>
    </div>
  );
}

// ── Telegram xabari ─────────────────────────────────────────
function buildTelegramMessage({ name, fullPhone, address, gps, itemsArray, totalPrice, paymentMethod }) {
  const lines = [];
  lines.push("🛎 Yangi buyurtma:");
  lines.push(`👤 Ism: ${name}`);
  lines.push(`📞 Telefon: ${fullPhone}`);   // ← to'liq raqam kod bilan
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

// ── Backendga saqlash ───────────────────────────────────────
async function saveOrderToBackend({ name, fullPhone, address, gps, itemsArray, paymentMethod, requestId }) {
  const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user || {};
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);

  try {
    const res = await fetch(`${API_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: ctrl.signal,
      body: JSON.stringify({
        requestId,
        userId:        tgUser.id || 0,
        name,
        phone:         fullPhone, // ← kod bilan
        address,
        gps:           gps || null,
        // ✅ FIX 1a: Faqat id va qty — narxni server hisoblaydi
        items: itemsArray.map((it) => ({ id: it.product.id, qty: it.qty })),
        paymentMethod,
        source:        "website",
        initData:      window.Telegram?.WebApp?.initData || "",
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        status: res.status,
        uncertain: res.status >= 500 || res.status === 429,
        error: data?.error || "Buyurtmani yuborishda xatolik yuz berdi.",
      };
    }

    return data;
  } catch (e) {
    console.warn("Backend saqlash xatosi:", e.message);
    return {
      success: false,
      uncertain: true,
      error: "Server javobi olinmadi. Buyurtma saqlangan bo'lishi mumkin. Iltimos, ayni buyurtmani qayta yuborishdan oldin tekshiring.",
    };
  } finally {
    clearTimeout(timer);
  }
}

// ── Asosiy Order ────────────────────────────────────────────
export default function Order() {
  const { lang } = useLanguage();
  const c = getOrderTranslations(lang);
  const { itemsArray, totalItems, totalPrice, setQty, removeFromCart, clearCart, menuStatus } = useCart();
  const [name, setName]               = useState("");
  const [phoneNum, setPhoneNum]       = useState("");   // faqat raqam qismi
  const [fullPhone, setFullPhone]     = useState("+998"); // kod + raqam
  const [address, setAddress]         = useState("");
  const [gps, setGps]                 = useState(null);
  const [paymentMethod, setPayment]   = useState("cash");
  const [error, setError]             = useState("");
  const [sending, setSending]         = useState(false);
  const submittingRef = useRef(false);
  const [success, setSuccess]         = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  const canSubmit = useMemo(() =>
    menuStatus === "ready" && totalItems > 0 && name.trim() && fullPhone.length > 5 && address.trim() && !sending,
    [name, fullPhone, address, totalItems, sending, menuStatus]
  );

  const telegramText = useMemo(() =>
    buildTelegramMessage({ name: name.trim() || "—", fullPhone: fullPhone || "—",
      address: address.trim() || "—", gps, itemsArray, totalPrice, paymentMethod }),
    [name, fullPhone, address, gps, itemsArray, totalPrice, paymentMethod]
  );

  // Buyurtma qayta yuborilganda bir xil requestId ishlatiladi.
  const getRequestId = (orderData) => {
    const key = "holland_pending_order";
    const fingerprint = JSON.stringify(orderData);

    try {
      const saved = JSON.parse(sessionStorage.getItem(key) || "null");

      if (saved?.fingerprint === fingerprint && saved?.requestId) {
        return saved.requestId;
      }

      const requestId = crypto.randomUUID();
      sessionStorage.setItem(key, JSON.stringify({ fingerprint, requestId }));
      return requestId;
    } catch {
      return crypto.randomUUID();
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (submittingRef.current) return;

    if (menuStatus !== "ready") {
      setError(c.menuUnavailable);
      return;
    }
    setError("");
    if (totalItems === 0) { setError(c.emptyError); return; }
    if (!name.trim() || name.trim().length < 2) { setError(c.nameError); return; }

    // ✅ FIX 2h: Telefon validatsiyasi — kamida 7 ta raqam
    const digits = fullPhone.replace(/\D/g, "");
    if (digits.length < 9) { setError(c.phoneError); return; }

    // ✅ FIX 2h: Manzil validatsiyasi
    if (address.trim().length < 5) { setError(c.addressError); return; }

    submittingRef.current = true;
    setSending(true);
    setShowFallback(false);

    // ✅ FIX 2c: Javob tekshiriladi
    const orderData = {
      name: name.trim(),
      fullPhone,
      address: address.trim(),
      gps,
      items: itemsArray.map((it) => ({
        id: it.product.id,
        qty: it.qty,
      })),
      paymentMethod,
    };

    let result;

    try {
      const requestId = getRequestId(orderData);

      result = await saveOrderToBackend({
        name: orderData.name,
        fullPhone: orderData.fullPhone,
        address: orderData.address,
        gps: orderData.gps,
        itemsArray,
        paymentMethod: orderData.paymentMethod,
        requestId,
      });
    } catch (err) {
      console.error("Buyurtma yuborish xatosi:", err);
      result = {
        success: false,
        uncertain: true,
        error: "Buyurtma holatini aniqlab bo'lmadi. Qayta urinishdan oldin tekshiring.",
      };
    } finally {
      submittingRef.current = false;
      setSending(false);
    }

    // ✅ FIX 4: Dublikat buyurtma muammosi hal qilindi
    // Backend allaqachon adminga xabar yuboradi — deep link ochilmaydi
    if (result?.success) {
      try {
        sessionStorage.removeItem("holland_pending_order");
      } catch (err) {
        console.warn("Pending order tozalanmadi:", err);
      }

      clearCart();
      setSuccess(true);
      // Muvaffaqiyat xabari ekranda qoladi.
      // Mini App foydalanuvchi roziligisiz yopilmaydi.
    } else {
      // Backend ishlamadi — mijozga aniq xabar, Telegram fallback taklif qilinadi
      setError(result?.error || c.serverError);
      setShowFallback(
        !result?.uncertain &&
        result?.status === 503
      );
    }
  };

  // Backend ishlamagan holatda qo'lda Telegram'ga yuborish
  const sendViaTelegram = () => {
    window.open(getTelegramDeepLink(telegramText), "_blank", "noopener,noreferrer");
    // Telegram oynasi ochilgani xabar yuborilganini anglatmaydi.
    // Shuning uchun savatcha saqlanadi va success ko'rsatilmaydi.
  };

  const onCopy = async () => {
    try { await navigator.clipboard.writeText(telegramText); }
    catch { setError(c.copyError); }
  };

  // ── Muvaffaqiyat ekrani ──
  if (success) return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center sm:py-28">
      <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#92272D]/10 text-6xl">✅</div>
      <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-[#302824]">{c.success}</h2>
      <p className="mb-8 text-sm leading-7 text-[#73695E]">{c.successHint}</p>
      <a href="/" className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors">
        🏠 Bosh sahifaga
      </a>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#EDE2D3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-[#302824]">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-[-0.055em] text-[#302824]">{c.title}</h1>
          <p className="mt-2 text-gray-600">{c.subtitle}</p>
        </div>
        {totalItems > 0 && (
          <button onClick={clearCart}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#EDE2D3] hover:bg-[#DCC9B3] transition-colors font-semibold text-sm">
            Savatni tozalash
          </button>
        )}
      </div>

      <div className="grid min-w-0 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] gap-6 lg:gap-8 items-start">
        {/* Savat */}
        <div className="min-w-0 rounded-[28px] bg-white/90 border border-[#C79B64]/30 p-4 sm:p-7 shadow-[0_16px_50px_rgba(48,40,36,0.06)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-extrabold text-[#302824]">{c.cart}</h2>
            <div className="text-sm text-gray-500">{totalItems} {c.itemCount}</div>
          </div>
          {itemsArray.length === 0 ? (
            <div className="rounded-[24px] border border-[#C79B64]/30 bg-[#F5E9D9] p-10 text-center font-medium text-[#73695E]">
              Savat bo'sh. Menu sahifasidan mahsulot qo'shing.
            </div>
          ) : (
            <div className="space-y-4">
              {itemsArray.map((it) => (
                <div key={it.product.id} className="flex gap-4 rounded-2xl border border-[#E2D2C0] bg-[#FBF8F3] p-4">
                  <img src={it.product.image} alt={it.product.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-contain bg-white p-1 flex-shrink-0" loading="lazy"/>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 text-sm truncate">{it.product.name}</div>
                        <div className="text-sm text-gray-500 mt-0.5">{formatSum(it.product.price)} so'm</div>
                      </div>
                      <button onClick={() => removeFromCart(it.product.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-red-50 hover:text-red-600 transition-colors flex-shrink-0">
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setQty(it.product.id, it.qty - 1)}
                          className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#EDE2D3] hover:bg-[#DCC9B3] transition-colors">
                          <Minus size={16} />
                        </button>
                        <span className="min-w-7 text-center font-bold">{it.qty}</span>
                        <button onClick={() => setQty(it.product.id, it.qty + 1)}
                          className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#92272D] text-white hover:bg-[#781D23] transition-colors">
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="text-sm font-bold text-gray-900">{formatSum(it.qty * it.product.price)} so'm</div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-[#E2D2C0] flex items-center justify-between">
                <div className="font-semibold text-gray-700">{c.total}</div>
                <div className="text-xl font-extrabold text-[#92272D]">{formatSum(totalPrice)} so'm</div>
              </div>
            </div>
          )}
        </div>

        {/* Forma */}
        <div className="min-w-0 rounded-[28px] bg-white/90 border border-[#C79B64]/30 p-4 sm:p-7 shadow-[0_16px_50px_rgba(48,40,36,0.06)]">
          <h2 className="text-xl font-extrabold text-[#302824] mb-1">{c.details}</h2>
          <p className="text-sm text-gray-500 mb-6">{c.detailsHint}</p>

          <form onSubmit={onSubmit} className="space-y-5">
            {menuStatus !== "ready" && (
              <div role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
                {menuStatus === "loading"
                  ? c.menuLoading
                  : c.menuUnavailable}
              </div>
            )}
            {/* Ism */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">👤 {c.name}</label>
              <input value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:outline-none focus:ring-0 focus:shadow-none focus:border-[#92272D] transition-colors font-medium text-sm outline-none focus:outline-none focus:ring-0 focus:shadow-none"
                placeholder={c.namePlaceholder}/>
            </div>

            {/* Telefon */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block">📞 {c.phone}</label>
              {/* ✅ FIX 2a: fullPhone state orqali kod + raqam yuboriladi */}
              <PhoneInput value={phoneNum} onChange={setPhoneNum} onFullPhone={setFullPhone} />
            </div>

            {/* Manzil */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block">📍 {c.address}</label>
              <AddressField address={address} onAddress={setAddress} onGps={setGps} />
            </div>

            {/* To'lov turi */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">💳 {c.payment}</label>
              <div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-3">
                <button type="button" onClick={() => setPayment("cash")}
                  className={`flex items-center justify-center gap-2 py-3 rounded-2xl border-2 font-semibold text-sm transition-all ${
                    paymentMethod === "cash" ? "border-[#92272D] bg-[#92272D]/10 text-[#92272D]" : "border-gray-200 hover:border-gray-300"
                  }`}>
                  <Banknote size={18} /> {c.cash}
                </button>
                <button type="button" onClick={() => setPayment("card")}
                  className={`flex items-center justify-center gap-2 py-3 rounded-2xl border-2 font-semibold text-sm transition-all ${
                    paymentMethod === "card" ? "border-[#92272D] bg-[#92272D]/10 text-[#92272D]" : "border-gray-200 hover:border-gray-300"
                  }`}>
                  <CreditCard size={18} /> {c.card}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm font-semibold">
                ⚠️ {error}
              </div>
            )}

            {/* ✅ Backend ishlamagan holatda zaxira variant */}
            {showFallback && (
              <button type="button" onClick={sendViaTelegram}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                📨 Telegram orqali yuborish
              </button>
            )}

            <button type="submit" disabled={!canSubmit}
              className={`w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-base transition-all ${
                canSubmit ? "bg-[#92272D] text-white hover:bg-[#781D23] shadow-sm hover:shadow-lg active:scale-98" : "bg-[#D8C9B8] text-[#73695E] cursor-not-allowed"
              }`}>
              {sending ? (<><Loader2 size={18} className="animate-spin" />{c.sending}</>) : `✅ ${c.submit}`}
            </button>

            <button type="button" onClick={onCopy}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200">
              📋 Matnni nusxa olish
            </button>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
}