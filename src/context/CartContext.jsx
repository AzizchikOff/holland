import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const { product, qty = 1 } = action;
      const existing = state.items[product.id];
      const nextQty = Math.min(99, (existing?.qty ?? 0) + qty);
      return {
        ...state,
        items: {
          ...state.items,
          [product.id]: { product, qty: nextQty },
        },
      };
    }
    case "REMOVE": {
      const { productId } = action;
      const nextItems = { ...state.items };
      delete nextItems[productId];
      return { ...state, items: nextItems };
    }
    case "SET_QTY": {
      const { productId, qty } = action;
      const existing = state.items[productId];
      if (!existing) return state;
      const nextQty = Math.max(0, Math.min(99, qty));
      if (nextQty === 0) {
        const nextItems = { ...state.items };
        delete nextItems[productId];
        return { ...state, items: nextItems };
      }
      return {
        ...state,
        items: {
          ...state.items,
          [productId]: { ...existing, qty: nextQty },
        },
      };
    }
    case "CLEAR":
      return { ...state, items: {} };
    case "HYDRATE":
      return action.state;
    default:
      return state;
  }
}

function loadInitialCart() {
  try {
    const raw = localStorage.getItem("cart_v1");
    if (!raw) return { items: {} };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return { items: {} };
    if (!parsed.items || typeof parsed.items !== "object") return { items: {} };
    return { items: parsed.items };
  } catch {
    return { items: {} };
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: {} });

  useEffect(() => {
    dispatch({ type: "HYDRATE", state: loadInitialCart() });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("cart_v1", JSON.stringify(state));
    } catch {
      // ignore storage errors (private mode, quota, etc.)
    }
  }, [state]);

  const itemsArray = useMemo(() => Object.values(state.items), [state.items]);
  const totalItems = useMemo(
    () => itemsArray.reduce((sum, it) => sum + (it.qty || 0), 0),
    [itemsArray],
  );
  const totalPrice = useMemo(
    () =>
      itemsArray.reduce(
        (sum, it) => sum + (it.qty || 0) * (it.product?.price || 0),
        0,
      ),
    [itemsArray],
  );

  const value = useMemo(
    () => ({
      items: state.items,
      itemsArray,
      totalItems,
      totalPrice,
      addToCart: (product, qty = 1) => dispatch({ type: "ADD", product, qty }),
      removeFromCart: (productId) => dispatch({ type: "REMOVE", productId }),
      setQty: (productId, qty) => dispatch({ type: "SET_QTY", productId, qty }),
      clearCart: () => dispatch({ type: "CLEAR" }),
    }),
    [state.items, itemsArray, totalItems, totalPrice],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
