import { useMemo, useState } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { categories, products } from "../data/products.js";

export default function Menu() {
  const { t } = useLanguage();
  const [active, setActive] = useState("all");

  const filtered = useMemo(() => {
    if (active === "all") return products;
    return products.filter((p) => p.category === active);
  }, [active]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            {t("menu")}
          </h1>
          <p className="mt-2 text-gray-600">
            {t("choose")}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActive("all")}
          className={[
            "px-4 py-2 rounded-xl text-sm font-semibold transition-colors",
            active === "all"
              ? "bg-red-600 text-white"
              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
          ].join(" ")}
        >
          {t("all")}
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            className={[
              "px-4 py-2 rounded-xl text-sm font-semibold transition-colors",
              active === c.id
                ? "bg-red-600 text-white"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
            ].join(" ")}
          >
            {t(`category_${c.id}`)}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}