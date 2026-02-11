import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import BagItem from "../components/BagItem";
import OrderSummary from "../components/OrderSummary";
import RelatedProducts from "../components/RelatedProducts";
import { getShoppingBagRecommendations, GalleryItem } from "../services/api";
import { FaShoppingBag, FaArrowRight } from "react-icons/fa";

const ShoppingBagPage: React.FC = () => {
  const { cartItems } = useCart();
  const [recommendations, setRecommendations] = useState<GalleryItem[]>([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await getShoppingBagRecommendations();
        setRecommendations(data);
      } catch (error) {
        console.error("Failed to load recommendations", error);
      }
    };
    fetchRecommendations();
  }, []);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
          <FaShoppingBag className="text-3xl text-gray-500" />
        </div>
        <h1 className="text-4xl font-serif font-bold mb-4">
          Your bag is empty
        </h1>
        <p className="text-gray-400 mb-8 text-center max-w-md">
          The world is waiting. Explore our collection of cinematic footage and
          fine art prints.
        </p>
        <Link
          to="/gallery"
          className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-accent transition-colors flex items-center gap-2"
        >
          <span>Explore Gallery</span>
          <FaArrowRight />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white pt-24 pb-20">
      <div className="container mx-auto px-4 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-12 border-b border-white/10 pb-6">
          Shopping Bag
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* LEFT: CART ITEMS */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-gray-900/50 border border-white/10 rounded-2xl overflow-hidden p-6 md:p-8">
              {cartItems.map((item) => (
                <BagItem key={item.cartId} item={item} />
              ))}
            </div>

            <Link
              to="/gallery"
              className="inline-flex items-center text-gray-400 hover:text-white transition-colors text-sm uppercase tracking-widest font-bold mt-4"
            >
              <FaArrowRight className="rotate-180 mr-2" /> Continue Shopping
            </Link>
          </div>

          {/* RIGHT: SUMMARY (Sticky) */}
          <div className="lg:col-span-4">
            <div className="sticky top-32">
              <OrderSummary />

              {/* Security Note */}
              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500 uppercase tracking-wider">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        <div className="mt-32">
          <RelatedProducts products={recommendations} contextType="all" />
        </div>
      </div>
    </div>
  );
};

export default ShoppingBagPage;
