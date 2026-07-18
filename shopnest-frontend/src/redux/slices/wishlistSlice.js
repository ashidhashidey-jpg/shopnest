import { createSlice } from '@reduxjs/toolkit';

const wishlistFromStorage = (() => {
  try {
    const stored = localStorage.getItem('wishlistItems');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
})();

const persist = (items) => {
  localStorage.setItem('wishlistItems', JSON.stringify(items));
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: wishlistFromStorage, // [{ productId, name, price, imageUrl }]
  },
  reducers: {
    addToWishlist: (state, action) => {
      const exists = state.items.some((i) => i.productId === action.payload.productId);
      if (!exists) {
        state.items.push(action.payload);
        persist(state.items);
      }
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      persist(state.items);
    },
    toggleWishlist: (state, action) => {
      const idx = state.items.findIndex((i) => i.productId === action.payload.productId);
      if (idx === -1) {
        state.items.push(action.payload);
      } else {
        state.items.splice(idx, 1);
      }
      persist(state.items);
    },
    clearWishlist: (state) => {
      state.items = [];
      persist(state.items);
    },
  },
});

export const { addToWishlist, removeFromWishlist, toggleWishlist, clearWishlist } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;
