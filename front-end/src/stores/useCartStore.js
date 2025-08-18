// cartStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (article) => {
        const currentInCart = get().cart.find(item => item.id === article.id);
        const currentQty = currentInCart ? currentInCart.quantity : 0;
        const availableStock = article.stock || 0;

        if (currentQty >= availableStock) {
          alert("Stock épuisé pour cet article !");
          return;
        }

        if (currentInCart) {
          set({
            cart: get().cart.map(item =>
              item.id === article.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          });
        } else {
          set({
            cart: [...get().cart, { ...article, quantity: 1 }]
          });
        }
      },

      removeFromCart: (id) => {
        set({
          cart: get().cart.filter(item => item.id !== id)
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          set({
            cart: get().cart.filter(item => item.id !== id)
          });
          return;
        }

        set({
          cart: get().cart.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        });
      },

      clearCart: () => {
        set({ cart: [] });
      },

      substractQuantity: (id) => {
        const currentInCart = get().cart.find(item => item.id === id);
        if (currentInCart && currentInCart.quantity > 1) {
          set({
            cart: get().cart.map(item =>
              item.id === id
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
          });
        } else {
          get().removeFromCart(id);
        }
      },

    }),
    {
      name: 'cart-storage', // Stocké dans localStorage
    }
  )
);