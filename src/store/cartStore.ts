// store/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Опис одного поля калькулятора (використовується в послугах)
export interface CalculatorField {
  type: 'select' | 'range' | 'number';
  label: string;
  key: string;
  min?: number;
  max?: number;
  step?: number;
  default?: any;
  options?: { label: string; value: number }[];
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image?: string; // тепер необов'язковий
  category: string;
  quantity: number;
  originalPrice?: number;
  discount?: number;
  icon?: string; // для товарів без фото
  options?: Record<string, any>;
  calculatorData?: {
    fields: CalculatorField[];
    values: Record<string, any>;
    basePrice: number;
  };
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateItem: (id: string, updates: Partial<Omit<CartItem, 'id'>>) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const qty = item.quantity || 1;
        const { id, ...rest } = item;
        const existing = get().items.find(i => i.id === id);
        
        if (existing) {
          // Якщо товар вже є – додаємо кількість
          set((state) => ({
            items: state.items.map(i =>
              i.id === id
                ? { ...i, quantity: i.quantity + qty }
                : i
            ),
          }));
        } else {
          // Новий товар – додаємо з вказаною кількістю
          set((state) => ({
            items: [...state.items, { ...rest, id, quantity: qty }],
          }));
        }
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter(i => i.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map(i =>
            i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
          ),
        }));
      },

      updateItem: (id, updates) => {
        set((state) => ({
          items: state.items.map(i =>
            i.id === id ? { ...i, ...updates } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
);