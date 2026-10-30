import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from './types'

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item: CartItem) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.productId === item.productId)
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            }
          }
          return { items: [...state.items, item] }
        })
      },
      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }))
      },
      updateQuantity: (productId: string, quantity: number) => {
        set((state) => ({
          items: state.items
            .map((i) => (i.productId === productId ? { ...i, quantity } : i))
            .filter((i) => i.quantity > 0),
        }))
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        const state = get()
        return state.items.reduce((total, item) => total + (item.price || 0) * item.quantity, 0)
      },
      getItemCount: () => {
        const state = get()
        return state.items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)
