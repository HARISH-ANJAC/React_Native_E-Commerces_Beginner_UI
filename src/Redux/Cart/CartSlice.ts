// Redux/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../@types';

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // ✅ Add product to cart (or increase qty if already exists)
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },

    // ✅ Remove item completely
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },

    // ✅ Increase quantity
    increaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) item.quantity += 1;
    },

    // ✅ Decrease quantity (remove if 0)
    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter(i => i.id !== action.payload);
        }
      }
    },

    // ✅ Clear cart
    clearCart: state => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
