// components/floating-cart.tsx
"use client";
import { useEffect, useState } from 'react';

type FloatingCartProps = {
  totalItems: number;
};

export default function FloatingCart({ totalItems }: FloatingCartProps) {
  const [visible, setVisible] = useState(true);

  // 滾動到購物車
  const scrollToCart = () => {
    const cartSection = document.getElementById("cart");
    if (cartSection) {
      cartSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 當畫面有滾動一點才顯示按鈕（可選）
  // useEffect(() => {
  //   const handleScroll = () => {
  //     setVisible(window.scrollY > 100);
  //   };
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  return (
    <button
      onClick={scrollToCart}
      className={`fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full shadow-lg bg-gray-600 text-white w-14 h-14 transition-transform duration-200 active:scale-95 hover:scale-110 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* <ShoppingCart size={24} /> */}
      🛒
      {/* 購物車 */}
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
          {totalItems}
        </span>
      )}
    </button>
  );
}
