import { Link } from "react-router-dom";
import { useLanguage } from "../context/useLanguage.js";
import ProductCard from "../components/ProductCard.jsx";
import { useCart } from "../context/useCart.js";

export default function Home() {
  const { products } = useCart();
  const popular = products.filter(p => p.popular && p.available !== false).slice(0, 4);
  const { t } = useLanguage();

  return (
    <div>
      {/* Hero — gradient inline style bilan (Tailwind v4 da ishonchli ishlaydi) */}
      <section
        className="text-white"
        style={{ background: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-sm"
                style={{ background: "rgba(255,255,255,0.15)" }}
              >
                {t("heroBadge")}
              </div>
              <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold tracking-tight">
                {t("heroTitle")} <br className="hidden sm:block" />
                {t("heroSubtitle")}
              </h1>
              <p className="mt-5 text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.9)" }}>
                {t("heroDesc")}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/menu"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-2xl font-bold transition-colors"
                  style={{ background: "#facc15", color: "#991b1b" }}
                >
                  {t("viewMenu")}
                </Link>
                <Link
                  to="/order"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-2xl font-semibold transition-colors"
                  style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}
                >
                  {t("orderNow")}
                </Link>
              </div>


            </div>

            <div className="lg:justify-self-end">
              <div
                className="rounded-3xl p-6"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
              >
                <div className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.8)" }}>
                  {t("popular")}
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {popular.slice(0, 2).map((p) => (
                    <div key={p.id} className="rounded-2xl bg-white p-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-24 object-cover rounded-xl bg-gray-50"
                        loading="eager"
                        fetchPriority="high"
                      />
                      <div className="mt-2 text-gray-900 font-semibold text-sm">
                        {p.name}
                      </div>
                      <div className="text-gray-600 text-xs">
                        {t("addFromMenu")}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5">
                  <Link
                    to="/menu"
                    className="inline-flex w-full items-center justify-center px-5 py-3 rounded-2xl font-bold transition-colors"
                    style={{ background: "#facc15", color: "#991b1b" }}
                  >
                    {t("allProducts")} →
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
              {t("popular")}
            </h2>
            <p className="mt-2 text-gray-600">
              {t("popularDesc")}
            </p>
          </div>
          <Link
            to="/menu"
            className="hidden sm:inline-flex px-4 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 font-semibold text-sm"
          >
            {t("menu")} →
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
                {t("about")}
              </h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                {t("aboutPreview")}
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-gray-900 text-white font-semibold hover:bg-black transition-colors"
                >
                  {t("learnMore")}
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-gray-50 text-gray-900 font-semibold hover:bg-gray-100 transition-colors"
                >
                  {t("contact")}
                </Link>
              </div>
            </div>

            <div
              className="rounded-3xl border border-gray-100 p-8"
              style={{ background: "linear-gradient(135deg, rgba(250,204,21,0.3) 0%, rgba(220,38,38,0.1) 100%)" }}
            >
              <div className="text-sm font-semibold text-gray-700">
                {t("orderReady")}
              </div>
              <div className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900">
                {t("orderPrompt")}
              </div>
              <div className="mt-5">
                <Link
                  to="/order"
                  className="inline-flex w-full items-center justify-center px-6 py-3.5 rounded-2xl text-white font-bold transition-colors"
                  style={{ background: "#dc2626" }}
                >
                  {t("goOrder")} →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}