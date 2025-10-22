"use client";
import React, { useMemo, useState } from "react";

import sampleSeries from "@/../public/products.json";
import { CartItem, Product, ProductSeries } from "@/constants";

import FloatingCart from "../ui/floating-cart";
import CartSection from "../purchase/cart-section";
import ProductSeriesList from "../purchase/product-series-list";
import ValidationPanel from "../purchase/validation-panel";
import PageIntro from "../page-intro";

const SAMPLE_SERIES = sampleSeries as ProductSeries[];

export default function PurchaseRuleChecker() {
  // series (原本的 products 陣列) — 每個 series 包含 items
  const [series] = useState<ProductSeries[]>(SAMPLE_SERIES);

  // flatProducts 用於以 id 找到單一 Product
  const flatProducts = useMemo<Product[]>(
    () => series.flatMap((s) => s.items),
    [series]
  );

  // cart: key = productId, value = qty
  const [cart, setCart] = useState<Record<string, number>>({});

  // expand state: 哪些 series 被展開
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  function addToCart(productId: string) {
    setCart((c) => ({ ...c, [productId]: (c[productId] || 0) + 1 }));
  }

  function setQty(productId: string, qty: number) {
    if (qty <= 0) {
      setCart((c) => {
        const copy = { ...c };
        delete copy[productId];
        return copy;
      });
      return;
    }
    setCart((c) => ({ ...c, [productId]: qty }));
  }

  function removeOne(productId: string) {
    setCart((c) => {
      const current = c[productId] || 0;
      if (current <= 1) {
        const copy = { ...c };
        delete copy[productId];
        return copy;
      }
      return { ...c, [productId]: current - 1 };
    });
  }

  const cartItems = useMemo<CartItem[]>(() => {
    return Object.entries(cart)
      .map(([name, qty]) => {
        const product = flatProducts.find((fp) => fp.name === name);
        if (!product) return null;

        const subtotal = (product.price ?? 0) * qty;

        return { product, qty, subtotal };
      })
      .filter((x): x is CartItem => x !== null);
  }, [cart, flatProducts]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold">鬼滅百景｜購物數量計算器</h1>
      <PageIntro />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {/* <div className="md:col-span-2"> */}
        <div className="md:col-span-2">
          <ProductSeriesList
            series={series}
            expanded={expanded}
            setExpanded={setExpanded}
            addToCart={addToCart}
          />

          <CartSection
            cartItems={cartItems}
            setQty={setQty}
            removeOne={removeOne}
          />
          <FloatingCart totalItems={cartItems.reduce((s, i) => s + i.qty, 0)} />
        </div>

        <ValidationPanel cartItems={cartItems} />
      </div>

      <footer className="mt-6 text-sm text-subText">
        <div>
          此網頁為粉絲自行製作，非官方提供，不保證完全正確，一切規則還請以官方公布內容為準。
        </div>
      </footer>
    </div>
  );
}
