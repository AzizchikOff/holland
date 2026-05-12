import { useMemo, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import { categories, products } from "../data/products.js";

const CATEGORY_ICONS = {
  all:    "🍽️",
  free:   "🍟",
  sous:   "🥫",
  hotdog: "🌭",
  burger: "🍔",
  drink:  "🥤",
};

export default function Menu() {
  const [active, setActive] = useState("all");

  const filtered = useMemo(() => {
    if (active === "all") return products;
    return products.filter((p) => p.category === active);
  }, [active]);

  const allCategories = [
    { id: "all", label: "Barchasi" },
    ...categories,
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          🍽️ Menu
        </h1>
        <p className="mt-1 text-gray-500 text-sm">
          Kategoriyani tanlang va mahsulotlarni savatga qo'shing
        </p>
      </div>

      {/* Filter tugmachalari — horizontal scroll */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
        <div className="flex gap-2 w-max sm:w-auto sm:flex-wrap">
          {allCategories.map((c) => {
            const isActive = active === c.id;
            const count = c.id === "all"
              ? products.length
              : products.filter((p) => p.category === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={[
                  "flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-200 active:scale-95",
                  isActive
                    ? "bg-red-600 text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-red-300 hover:text-red-600",
                ].join(" ")}
              >
                <span>{CATEGORY_ICONS[c.id] ?? "•"}</span>
                {c.label}
                <span
                  className={[
                    "text-xs font-semibold px-1.5 py-0.5 rounded-full",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-500",
                  ].join(" ")}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Natija soni */}
      <p className="mt-5 text-sm text-gray-500 font-medium">
        {filtered.length} ta mahsulot
        {active !== "all" && (
          <button
            onClick={() => setActive("all")}
            className="ml-2 text-red-600 hover:underline"
          >
            × filterni tozalash
          </button>
        )}
      </p>

      {/* Mahsulotlar grid */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-20 text-center text-gray-400">
          <p className="text-4xl">🔍</p>
          <p className="mt-3 font-semibold">Bu kategoriyada mahsulot yo'q</p>
        </div>
      )}
    </div>
  );
}
