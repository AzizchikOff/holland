/**
 * Holland's single menu transport.
 * Server controls product IDs, prices and availability.
 * Image paths remain an explicit allowlist until a managed CDN is configured.
 */
import { categories as fallbackCategories, products as fallbackProducts } from "../data/products.js";

const API_BASE = "https://holland-bot.onrender.com";
const imageById = Object.fromEntries(fallbackProducts.map((p) => [String(p.id), p.image]));
const extrasById = Object.fromEntries(fallbackProducts.map((p) => [String(p.id), p]));
const ALLOWED_IMAGE_ORIGIN = "https://holland-namangan.netlify.app";

function safeImage(value, fallback) {
  if (typeof value !== "string") return fallback;
  try {
    const url = new URL(value, ALLOWED_IMAGE_ORIGIN);
    if (url.origin !== ALLOWED_IMAGE_ORIGIN || !url.pathname.startsWith("/images/")) return fallback;
    return url.href;
  } catch {
    return fallback;
  }
}

export function normalizeMenu(payload) {
  if (!payload || !Array.isArray(payload.items) || !Array.isArray(payload.categories)) {
    throw new Error("Menu API formati noto'g'ri");
  }
  const products = payload.items.map((item) => {
    const id = String(item.id ?? "");
    const existing = extrasById[id];
    const price = Number(item.price);
    if (!id || !existing || !Number.isSafeInteger(price) || price < 0) return null;
    const category = String(item.cat ?? item.category ?? "");
    if (!fallbackCategories.some((c) => c.id === category)) return null;
    return {
      ...existing,
      id,
      name: String(item.name ?? existing.name).slice(0, 120),
      category,
      price,
      image: safeImage(item.image ?? (item.img ? `/images/${item.img}` : null), imageById[id]),
      available: item.available !== false,
    };
  }).filter(Boolean);
  if (!products.length) throw new Error("Menu API bo'sh");
  return {
    categories: fallbackCategories,
    products,
  };
}

export async function fetchMenu({ signal } = {}) {
  const response = await fetch(`${API_BASE}/api/menu`, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
  });
  if (!response.ok) throw new Error(`Menu API: ${response.status}`);
  return normalizeMenu(await response.json());
}

/** Local catalog is a temporary read-only fallback; never use it to calculate backend totals. */
export function getFallbackMenu() {
  return { categories: fallbackCategories, products: fallbackProducts };
}
