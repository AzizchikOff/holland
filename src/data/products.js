// ══════════════════════════════════════════════════════════
//  Holland Fast Food — Mahsulotlar katalogi
//
//  ⚠️ MUHIM: Bu ro'yxat bot/server.js dagi MENU bilan
//  AYNAN BIR XIL bo'lishi shart (id, name, price).
//  Narx o'zgartirsangiz — ikkala faylni ham yangilang!
//
//  Mahsulot tavsiflari umumiy xarakterda; haqiqiy retsept va allergenlar restoran tomonidan tasdiqlanishi kerak.
// ══════════════════════════════════════════════════════════

export const categories = [
  { id: "free",   label: "Holland Free" },
  { id: "burger", label: "Burger"        },
  { id: "hotdog", label: "Hot-dog"       },
  { id: "sous",   label: "Sous"          },
  { id: "drink",  label: "Ichimliklar"   },
];

export const products = [
  // ── Holland Free ──────────────────────────────────────
  { id: "1",  name: "Free Holland",           category: "free",   price: 19000, image: "/images/free-classik.jpg",  popular: true  },
  // ⚠️ free-big.jpg rasmi mavjud emas edi — free-classik.jpg ishlatilmoqda
  { id: "2",  name: "Free Holland Big",       category: "free",   price: 23000, image: "/images/free-classik.jpg",  popular: false },
  { id: "3",  name: "Free Holland Special",   category: "free",   price: 35000, image: "/images/special.jpg",       popular: true  },
  { id: "4",  name: "Loaded Fries",           category: "free",   price: 32000, image: "/images/loaded.png",        popular: true  },
  { id: "5",  name: "Loaded Fries & Sausage", category: "free",   price: 28000, image: "/images/Loaded fries.jpg",  popular: false },
  { id: "6",  name: "Loaded Cheese",          category: "free",   price: 26000, image: "/images/loaded-cheese.jpg", popular: false },
  { id: "7",  name: "Chicken Cheese",         category: "free",   price: 42000, image: "/images/Chickencheese.jpg", popular: true  },
  { id: "8",  name: "Crispy Chicken",         category: "free",   price: 38000, image: "/images/crispy.jpg",        popular: false },
  { id: "9",  name: "Beef Box",               category: "free",   price: 55000, image: "/images/bifbox.jpg",        popular: false },
  { id: "13", name: "Kapsalan (lahm)",        category: "free",   price: 75000, image: "/images/kapsalan.jpg",      popular: false },
  { id: "14", name: "Kapsalan (qiyma)",       category: "free",   price: 58000, image: "/images/kapsalan.jpg",      popular: false },
  { id: "15", name: "Berlin Style (lahm)",    category: "free",   price: 58000, image: "/images/berlin.jpg",        popular: true  },
  { id: "16", name: "Berlin Style (qiyma)",   category: "free",   price: 48000, image: "/images/berlin.jpg",        popular: false },
  { id: "17", name: "Briosh Steak Box",       category: "free",   price: 65000, image: "/images/BrioshSteak.jpg",   popular: true  },

  // ── Burger ────────────────────────────────────────────
  { id: "10", name: "Chicken Burger",         category: "burger", price: 35000, image: "/images/burger.jpg",        popular: false },
  { id: "19", name: "Bon File (lahm)",        category: "burger", price: 48000, image: "/images/Bonfile.jpg",       popular: false },
  { id: "20", name: "Bon File (qiyma)",       category: "burger", price: 38000, image: "/images/Bonfile.jpg",       popular: false },

  // ── Hot-dog ───────────────────────────────────────────
  { id: "11", name: "Hot-Dog Classic",        category: "hotdog", price: 15000, image: "/images/hotdog.jpg",        popular: false },
  { id: "12", name: "Hot-Dog Canada",         category: "hotdog", price: 20000, image: "/images/hotdog-canada.jpg", popular: false },
  { id: "18", name: "Free-Dog",               category: "hotdog", price: 28000, image: "/images/free-dog.jpg",      popular: true  },

  // ── Sous ──────────────────────────────────────────────
  { id: "21", name: "Berlin Sous",            category: "sous",   price: 4000,  image: "/images/berlinSous.png",    popular: false },
  { id: "22", name: "Burger Sous",            category: "sous",   price: 4000,  image: "/images/burgerSous.png",    popular: false },
  { id: "23", name: "BBQ Sous",               category: "sous",   price: 4000,  image: "/images/bbq.png",           popular: false },
  { id: "24", name: "Ketchup-Mayonez",        category: "sous",   price: 4000,  image: "/images/ketchup.png",       popular: false },

  // ── Ichimliklar ───────────────────────────────────────
  // ⚠️ Dublikatlar olib tashlandi: eski id 29/31 (Fanta 0.5L ikki xil narxda),
  //    33 (Coca Cola 0.5L), 36 (Fuse Tea plastik) — server ro'yxatida yo'q edi
  { id: "25", name: "Sprite Mojito 0.5L",     category: "drink",  price: 8000,  image: "/images/sprite-moxito.jpg",    popular: false },
  { id: "26", name: "Sprite 0.5L",            category: "drink",  price: 8000,  image: "/images/sprite.jpg",           popular: false },
  { id: "27", name: "Sprite 0.25L",           category: "drink",  price: 7000,  image: "/images/sprite-banochniy.jpg", popular: false },
  { id: "28", name: "Fanta 0.25L (banka)",    category: "drink",  price: 7000,  image: "/images/fanta-banochniy.jpg",  popular: false },
  { id: "30", name: "Fanta 0.25L (plastik)",  category: "drink",  price: 10000, image: "/images/fanta.jpg",            popular: false },
  { id: "32", name: "Coca Cola 0.25L (banka)",category: "drink",  price: 7000,  image: "/images/cola-banochniy.jpg",   popular: false },
  { id: "34", name: "Coca Cola (shisha)",     category: "drink",  price: 10000, image: "/images/cola.jpg",             popular: false },
  { id: "35", name: "Fuse Tea 0.5L",          category: "drink",  price: 10000, image: "/images/fusetea-banochniy.jpg",popular: false },
  { id: "37", name: "Bonaqua 0.5L",           category: "drink",  price: 3000,  image: "/images/bon-aqua.jpg",         popular: false },
  { id: "38", name: "Cappy Pulpy 0.5L",       category: "drink",  price: 8000,  image: "/images/cappy.jpg",            popular: false },
];
// Tasdiqlanmagan retseptlarni taxmin qilmasdan, har bir mahsulotga
// individual tavsif va aniq tarkib uchun alohida maydon tayyorlaymiz.
const categoryDescriptions = {
  free: "Holland fast-food menyusidagi kartoshkali taom. Buyurtmadan oldin aniq tarkibini tekshiring.",
  burger: "Holland menyusidagi burger. Sous, non va boshqa ingredientlar haqida restoran bilan aniqlashtiring.",
  hotdog: "Holland menyusidagi hot-dog. Tarkibi va allergenlari restoran tomonidan tasdiqlanishi kerak.",
  sous: "Taomlarga qo‘shimcha sous. Allergiya bo‘lsa, tarkibini oldindan so‘rang.",
  drink: "Holland menyusidagi ichimlik. Tarkib va oziqaviy ma’lumotni qadoq yorlig‘idan tekshiring.",
};
for (const product of products) {
  product.description = `${product.name} — ${categoryDescriptions[product.category]}`;
  product.ingredients = [];
}
