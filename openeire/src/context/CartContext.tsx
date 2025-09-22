import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { GalleryItem } from "../services/api";

// --- Define the shape of our data with TypeScript ---

// Represents a single, unique item in the cart
export interface CartItem {
  id: string; // A unique ID for the cart item (e.g., "photo-1-4k")
  product: GalleryItem;
  quantity: number;
}

// Defines what our context will provide
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: GalleryItem, quantity: number) => void;
  itemCount: number;
}

// --- Create the Context ---
const CartContext = createContext<CartContextType | undefined>(undefined);

// --- Create the Provider Component ---
export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state from localStorage to persist cart across sessions
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const localData = localStorage.getItem("cart");
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Could not parse cart data from localStorage", error);
      return [];
    }
  });

  // Save to localStorage whenever cartItems state changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: GalleryItem, quantity: number) => {
    const newItemId = `${product.product_type}-${product.id}`;

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === newItemId);

      if (existingItem) {
        // If item already exists, just update the quantity
        return prevItems.map((item) =>
          item.id === newItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // If it's a new item, add it to the cart
        return [...prevItems, { id: newItemId, product, quantity }];
      }
    });
  };

  // A derived value to easily get the total number of items for the navbar icon
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

// --- Create a custom hook for easy access ---
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
