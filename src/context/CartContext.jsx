import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from "react";

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const { product, qty = 1 } = action;
      const existing = state.items[product.id];
      return {
        ...state,
        items: {
          ...state.items,
          [product.id]: { product, qty: Math.min(99, (existing?.qty ?? 0) + qty) },
        },
      };
    }
    case "REMOVE": {
      const next = { ...state.items };
      delete next[action.productId];
      return { ...state, items: next };
    }
    case "SET_QTY": {
      const existing = state.items[action.productId];
      if (!existing) return state;
      const qty = Math.max(0, Math.min(99, action.qty));
      if (qty === 0) {
        const next = { ...state.items };
        delete next[action.productId];
        return { ...state, items: next };
      }
      return { ...state, items: { ...state.items, [action.productId]: { ...existing, qty } } };
    }
    case "CLEAR":   return { ...state, items: {} };
    case "HYDRATE": return action.state;
    default:        return state;
  }
}

// localStorage + Telegram CloudStorage fallback
function loadCart() {
  try {
    // Telegram CloudStorage (async — faqat boshlang'ich qiymat uchun ishlamaydi, skip)
    const raw = localStorage.getItem("cart_v2");
    if (!raw) return { items: {} };
    const parsed = JSON.parse(raw);
    if (!parsed?.items || typeof parsed.items !== "object") return { items: {} };
    return { items: parsed.items };
  } catch {
    return { items: {} };
  }
}

function saveCart(state) {
  try {
    localStorage.setItem("cart_v2", JSON.stringify(state));
  } catch {
    // Private mode yoki kvota
  }
  // Telegram CloudStorage ga ham saqlaymiz (async)
  try {
    window.Telegram?.WebApp?.CloudStorage?.setItem(
      "cart_v2",
      JSON.stringify(state),
      () => {}
    );
  } catch {}
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: {} });
  const timerRef = useRef(null);

  // Boshlang'ich yuklash
  useEffect(() => {
    const local = loadCart();
    dispatch({ type: "HYDRATE", state: local });

    // Telegram CloudStorage dan ham tekshiramiz
    try {
      window.Telegram?.WebApp?.CloudStorage?.getItem("cart_v2", (err, val) => {
        if (!err && val) {
          try {
            const parsed = JSON.parse(val);
            if (parsed?.items) dispatch({ type: "HYDRATE", state: parsed });
          } catch {}
        }
      });
    } catch {}
  }, []);

  // Saqlash (debounce 200ms)
  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => saveCart(state), 200);
    return () => clearTimeout(timerRef.current);
  }, [state]);

  const value = useMemo(() => {
    const itemsArray = Object.values(state.items);
    return {
      items:         state.items,
      itemsArray,
      totalItems:    itemsArray.reduce((s, it) => s + (it.qty || 0), 0),
      totalPrice:    itemsArray.reduce((s, it) => s + (it.qty || 0) * (it.product?.price || 0), 0),
      addToCart:     (product, qty = 1) => dispatch({ type: "ADD", product, qty }),
      removeFromCart:(productId)        => dispatch({ type: "REMOVE", productId }),
      setQty:        (productId, qty)   => dispatch({ type: "SET_QTY", productId, qty }),
      clearCart:     ()                 => dispatch({ type: "CLEAR" }),
    };
  }, [state.items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
