import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { getPopularProducts } from "../data/products.js";

export default function Home() {
  const popular = getPopularProducts(4);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-red-500 to-red-300 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-white text-sm">
                Tez yetkazib berish • Halol • Issiq taom
              </div>
              <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold tracking-tight">
                Mazali fast food. <br className="hidden sm:block" />
                2–3 daqiqada buyurtma bering.
              </h1>
              <p className="mt-5 text-white/90 text-base sm:text-lg leading-relaxed">
                Menu'ni ko'ring, savatga qo'shing va buyurtmani Telegram orqali
                yuboring — hammasi juda oson.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/menu"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-2xl bg-yellow-400 text-red-800 font-bold hover:bg-white transition-colors"
                >
                  Menu'ni ko'rish
                </Link>
                <Link
                  to="/order"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-2xl bg-white/15 text-white font-semibold hover:bg-white hover:text-red-700 transition-colors"
                >
                  Buyurtma berish
                </Link>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4">
                <div className="rounded-2xl bg-white/10 p-4">
                  <div className="text-2xl font-extrabold">10–15</div>
                  <div className="text-sm text-white/80">daqiqa delivery</div>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <div className="text-2xl font-extrabold">100%</div>
                  <div className="text-sm text-white/80">halol mahsulot</div>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <div className="text-2xl font-extrabold">4.8★</div>
                  <div className="text-sm text-white/80">mijozlar bahosi</div>
                </div>
              </div>
            </div>

            <div className="lg:justify-self-end">
              <div className="rounded-3xl bg-white/10 border border-white/15 p-6">
                <div className="text-sm text-white/80 font-semibold">
                  Eng mashhur mahsulotlar
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {popular.slice(0, 2).map((p) => (
                    <div key={p.id} className="rounded-2xl bg-white p-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-24 object-cover rounded-xl bg-gray-50"
                        loading="lazy"
                      />
                      <div className="mt-2 text-gray-900 font-semibold text-sm">
                        {p.name}
                      </div>
                      <div className="text-gray-600 text-xs">
                        Menu'dan savatga qo'shing
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5">
                  <Link
                    to="/menu"
                    className="inline-flex w-full items-center justify-center px-5 py-3 rounded-2xl bg-yellow-400 text-red-800 font-bold hover:bg-white transition-colors"
                  >
                    Hamma mahsulotlar →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              Eng mashhur mahsulotlar
            </h2>
            <p className="mt-2 text-gray-600">
              3–5 ta top mahsulot — tez buyurtma uchun.
            </p>
          </div>
          <Link
            to="/menu"
            className="hidden sm:inline-flex px-4 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 font-semibold text-sm"
          >
            Menu →
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popular.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* About preview + CTA */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                Biz haqimizda
              </h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Holland — zamonaviy fast food: sifat, tezlik va mijozga qulay
                servis. Har bir buyurtma yangi tayyorlanadi.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-gray-900 text-white font-semibold hover:bg-black transition-colors"
                >
                  Batafsil
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-gray-50 text-gray-900 font-semibold hover:bg-gray-100 transition-colors"
                >
                  Aloqa
                </Link>
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-yellow-400/30 to-red-600/10 border border-gray-100 p-8">
              <div className="text-sm font-semibold text-gray-700">
                CTA — Buyurtma tayyor
              </div>
              <div className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900">
                Savatni to'ldiring va Telegram orqali yuboring.
              </div>
              <div className="mt-5">
                <Link
                  to="/order"
                  className="inline-flex w-full items-center justify-center px-6 py-3.5 rounded-2xl bg-red-600 text-white font-bold hover:bg-yellow-400 hover:text-red-800 transition-colors"
                >
                  Buyurtmaga o'tish →
                </Link>
              </div>
              
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
