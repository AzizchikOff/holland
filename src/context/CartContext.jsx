import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { getFallbackMenu, fetchMenu } from "../lib/menuApi.js";

import { CartContext } from "./CartContextValue.js";

// ✅ FIX 3: Faqat id + qty saqlanadi, narx katalogdan olinadi
// Shunda narx o'zgarsa eski savatdagi mijoz ham yangi narxni ko'radi
const PRODUCT_MAP = Object.fromEntries(getFallbackMenu().products.map(p => [p.id, p]));

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const { productId, qty = 1 } = action;
      if (!PRODUCT_MAP[productId]) return state;
      const existing = state.items[productId];
      const nextQty  = Math.min(20, Math.max(0, (existing?.qty ?? 0) + Number(qty || 0)));
      return { ...state, items: { ...state.items, [productId]: { qty: nextQty } } };
    }
    case "REMOVE": {
      const nextItems = { ...state.items };
      delete nextItems[action.productId];
      return { ...state, items: nextItems };
    }
    case "SET_QTY": {
      const { productId, qty } = action;
      if (!state.items[productId]) return state;
      const nextQty = Math.max(0, Math.min(20, Math.floor(Number(qty) || 0)));
      if (nextQty === 0) {
        const nextItems = { ...state.items };
        delete nextItems[productId];
        return { ...state, items: nextItems };
      }
      return { ...state, items: { ...state.items, [productId]: { qty: nextQty } } };
    }
    case "CLEAR":   return { ...state, items: {} };
    case "HYDRATE": return action.state;
    default:        return state;
  }
}

function loadInitialCart() {
  try {
    const raw = localStorage.getItem("cart_v2");   // v2 — yangi format
    if (!raw) return { items: {} };
    const parsed = JSON.parse(raw);
    if (!parsed?.items || typeof parsed.items !== "object") return { items: {} };

    // ✅ Katalogda yo'q mahsulotlarni tozalash
    const clean = {};
    for (const [id, item] of Object.entries(parsed.items)) {
      if (PRODUCT_MAP[id] && Number.isFinite(Number(item?.qty)) && Number(item.qty) > 0) clean[id] = { qty: Math.min(20, Math.floor(Number(item.qty))) };
    }
    return { items: clean };
  } catch {
    return { items: {} };
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadInitialCart);
  const saveTimeoutRef = useRef(null);
  const [catalog, setCatalog] = useState(getFallbackMenu);
  const [menuStatus, setMenuStatus] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();

    fetchMenu({ signal: controller.signal })
      .then((data) => {
        setCatalog(data);
        setMenuStatus("ready");
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.warn("Menu API unavailable:", error);
        setMenuStatus("fallback");
      });

    return () => controller.abort();
  }, []);

  const catalogMap = useMemo(
    () => Object.fromEntries(catalog.products.map(p => [p.id, p])),
    [catalog.products]
  );
  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      try { localStorage.setItem("cart_v2", JSON.stringify(state)); } catch (error) { console.warn("Cart storage unavailable:", error); }
    }, 100);
    return () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current); };
  }, [state]);

  const value = useMemo(() => {
    // ✅ Narx har safar katalogdan olinadi — hech qachon eskirmaydi
    const itemsArray = Object.entries(state.items)
      .map(([id, item]) => {
        const product = catalogMap[id];
        if (!product) return null;
        return { product, qty: item.qty };
      })
      .filter(Boolean);

    const totalItems = itemsArray.reduce((s, it) => s + it.qty, 0);
    const totalPrice = itemsArray.reduce((s, it) => s + it.qty * it.product.price, 0);

    return {
      items: state.items,
      itemsArray,
      products: catalog.products,
      categories: catalog.categories,
      menuStatus,
      totalItems,
      totalPrice,
      addToCart:      (product, qty = 1) => dispatch({ type: "ADD", productId: product.id, qty }),
      removeFromCart: (productId)        => dispatch({ type: "REMOVE", productId }),
      setQty:         (productId, qty)   => dispatch({ type: "SET_QTY", productId, qty }),
      clearCart:      ()                 => dispatch({ type: "CLEAR" }),
    };
  }, [state.items, catalog, catalogMap, menuStatus]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
