import { useMemo, useState } from "react";
import { useLanguage } from "../context/useLanguage.js";
import ProductCard from "../components/ProductCard.jsx";
import { useCart } from "../context/useCart.js";


export default function Menu() {
  const { t } = useLanguage();
  const { products, categories } = useCart();
  const [active, setActive] = useState("all");

  const filtered = useMemo(() => {
    if (active === "all") return products;
    return products.filter((p) => p.category === active);
  }, [active, products]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#171719]">
            {t("menu")}
          </h1>
          <p className="mt-2 text-[#6B6560]">
            {t("choose")}
          </p>
        </div>
      </div>

      <div className="cats-scroll mt-8 flex gap-2 overflow-x-auto pb-3">
        <button
          onClick={() => setActive("all")}
          className={[
            "shrink-0 px-5 py-3 rounded-full text-sm font-semibold transition-all duration-200",
            active === "all"
              ? "bg-[#A91F23] text-white shadow-md shadow-[#A91F23]/15"
              : "bg-white border border-[#EAE2D7] text-[#171719] hover:border-[#D8A65A] hover:bg-[#F8F5EF]",
          ].join(" ")}
        >
          {t("all")}
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            className={[
              "shrink-0 px-5 py-3 rounded-full text-sm font-semibold transition-all duration-200",
              active === c.id
                ? "bg-[#A91F23] text-white shadow-md shadow-[#A91F23]/15"
                : "bg-white border border-[#EAE2D7] text-[#171719] hover:border-[#D8A65A] hover:bg-[#F8F5EF]",
            ].join(" ")}
          >
            {t(`category_${c.id}`)}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}