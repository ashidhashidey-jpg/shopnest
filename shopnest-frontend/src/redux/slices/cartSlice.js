import { createSlice } from '@reduxjs/toolkit';

const cartFromStorage = (() => {
  try {
    const stored = localStorage.getItem('cartItems');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
})();

const persist = (items) => {
  localStorage.setItem('cartItems', JSON.stringify(items));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: cartFromStorage, // [{ productId, name, price, imageUrl, stock, qty }]
  },
  reducers: {
    addToCart: (state, action) => {
      const { productId, name, price, imageUrl, stock, qty = 1 } = action.payload;
      const existing = state.items.find((item) => item.productId === productId);
      if (existing) {
        existing.qty = Math.min(existing.qty + qty, stock ?? existing.qty + qty);
      } else {
        state.items.push({ productId, name, price, imageUrl, stock, qty: Math.max(1, qty) });
      }
      persist(state.items);
    },
    updateCartQty: (state, action) => {
      const { productId, qty } = action.payload;
      const item = state.items.find((i) => i.productId === productId);
      if (item) {
        item.qty = Math.max(1, Math.min(qty, item.stock ?? qty));
      }
      persist(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      persist(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      persist(state.items);
    },
  },
});

export const { addToCart, updateCartQty, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
