import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { getPopularProducts } from "../data/products.js";

export default function Home() {
  const popular = getPopularProducts(4);
  const [stats, setStats] = useState({ users: 0, orders: 0 });

  // Real statistika API dan
  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => {
        if (d?.users !== undefined) setStats(d);
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

            {/* Sol: matn */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-sm font-semibold mb-4">
                ⚡ Tez yetkazib berish &nbsp;·&nbsp; ✅ Halol &nbsp;·&nbsp; 🔥 Issiq taom
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                Mazali fast food.
                <br />
                <span className="text-yellow-300">2–3 daqiqada</span> buyurtma.
              </h1>

              <p className="mt-4 text-base sm:text-lg text-white/85 leading-relaxed">
                Menu'ni ko'ring, savatga qo'shing va buyurtmani Telegram orqali
                yuboring — hammasi juda oson.
              </p>

              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/menu"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-yellow-400 text-red-800 font-extrabold text-base hover:bg-yellow-300 active:scale-95 transition-all shadow-lg"
                >
                  🍔 Menu'ni ko'rish
                </Link>
                <Link
                  to="/order"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/15 text-white font-bold text-base hover:bg-white/25 active:scale-95 transition-all border border-white/20"
                >
                  🛒 Buyurtma berish
                </Link>
              </div>

              {/* Stats ─ real API dan */}
              <div className="mt-8 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-white/10 p-3 text-center">
                  <div className="text-xl sm:text-2xl font-extrabold">10–15</div>
                  <div className="text-xs text-white/75 mt-0.5">daqiqa delivery</div>
                </div>
                <div className="rounded-2xl bg-white/10 p-3 text-center">
                  <div className="text-xl sm:text-2xl font-extrabold">
                    {stats.users > 0 ? `${stats.users}+` : "100%"}
                  </div>
                  <div className="text-xs text-white/75 mt-0.5">
                    {stats.users > 0 ? "mijozlar" : "halol mahsulot"}
                  </div>
                </div>
                <div className="rounded-2xl bg-white/10 p-3 text-center">
                  <div className="text-xl sm:text-2xl font-extrabold">4.8★</div>
                  <div className="text-xs text-white/75 mt-0.5">reyting</div>
                </div>
              </div>
            </div>

            {/* O'ng: karta */}
            <div className="lg:justify-self-end w-full">
              <div className="rounded-3xl bg-white/10 border border-white/15 p-5 backdrop-blur-sm">
                <p className="text-sm font-bold text-white/80 mb-4">
                  🔥 Eng mashhur mahsulotlar
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {popular.slice(0, 2).map((p) => (
                    <div key={p.id} className="rounded-2xl bg-white overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.name}
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                        className="w-full h-24 object-cover"
                        loading="eager"
                      />
                      <div className="p-2">
                        <div className="text-gray-900 font-bold text-xs line-clamp-2">
                          {p.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  to="/menu"
                  className="mt-4 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-yellow-400 text-red-800 font-extrabold text-sm hover:bg-yellow-300 transition-colors"
                >
                  Barcha mahsulotlar →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Birinchi buyurtma promosyon ─────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <div className="rounded-2xl bg-yellow-50 border border-yellow-200 p-5 flex items-center justify-between gap-4">
          <div>
            <p className="font-extrabold text-yellow-800 text-base">
              🎁 Birinchi buyurtma!
            </p>
            <p className="text-yellow-700 text-sm mt-0.5">
              Maxsus chegirma va sovg'alar kutmoqda
            </p>
          </div>
          <Link
            to="/menu"
            className="shrink-0 px-4 py-2 rounded-xl bg-yellow-400 text-red-800 font-bold text-sm hover:bg-yellow-300 transition-colors"
          >
            Buyurtma →
          </Link>
        </div>
      </section>

      {/* ── Mashhur mahsulotlar ──────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-end justify-between gap-4 mb-7">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              🔥 Eng mashhur
            </h2>
            <p className="mt-1 text-gray-500 text-sm">
              Mijozlar eng ko'p buyurtma bergan mahsulotlar
            </p>
          </div>
          <Link
            to="/menu"
            className="hidden sm:inline-flex px-4 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 font-semibold text-sm transition-colors"
          >
            Hammasi →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popular.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <Link
          to="/menu"
          className="sm:hidden mt-5 flex items-center justify-center px-6 py-3 rounded-2xl bg-white border border-gray-200 font-semibold text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Barcha mahsulotlar →
        </Link>
      </section>

      {/* ── Afzalliklar ─────────────────────────────────── */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: "⚡", title: "Tez yetkazish", desc: "10–15 daqiqada eshigingizga" },
              { icon: "✅", title: "100% Halol",    desc: "Barcha mahsulotlar halol sertifikatlangan" },
              { icon: "🔥", title: "Har doim issiq", desc: "Buyurtma kelguncha issiqligini saqlaydi" },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 p-5 rounded-2xl bg-gray-50">
                <span className="text-3xl shrink-0">{icon}</span>
                <div>
                  <p className="font-extrabold text-gray-900">{title}</p>
                  <p className="text-sm text-gray-600 mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div
          className="rounded-3xl p-8 text-center"
          style={{ background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)" }}
        >
          <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Buyurtma berishga tayyormisiz?
          </h3>
          <p className="mt-2 text-gray-700">
            Savatni to'ldiring va Telegram orqali yuboring
          </p>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 mt-6 px-8 py-4 rounded-2xl bg-red-600 text-white font-extrabold text-base hover:bg-red-700 active:scale-95 transition-all shadow-lg"
          >
            🍔 Buyurtma berish
          </Link>
        </div>
      </section>
    </div>
  );
}
