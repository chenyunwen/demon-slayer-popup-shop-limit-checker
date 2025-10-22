"use client";
import React, { useMemo, useState } from "react";

import sampleSeries from "@/../public/products.json";
import { CartItem, CATEGORY_LABELS, Product, ProductSeries } from "@/constants";

import FloatingCart from "../ui/floating-cart";

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

  // const cartItems = useMemo<CartItem[]>(() => {
  //   return Object.entries(cart)
  //     .map(([id, qty]) => {
  //       const p = flatProducts.find((fp) => fp.id === id);
  //       if (!p) return null;
  //       return { product: p, qty };
  //     })
  //     .filter((x): x is CartItem => x !== null);
  // }, [cart, flatProducts]);

  const cartItems = useMemo<CartItem[]>(() => {
    return Object.entries(cart)
      .map(([id, qty]) => {
        const product = flatProducts.find((fp) => fp.id === id);
        if (!product) return null;

        const subtotal = (product.price ?? 0) * qty;

        return { product, qty, subtotal };
      })
      .filter((x): x is CartItem => x !== null);
  }, [cart, flatProducts]);

  // 💰 總金額
  const totalAmount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  }, [cartItems]);

  // 驗證邏輯（與你原本相同）
  function validateCart(items: CartItem[]) {
    const errors: string[] = [];

    const sumTotal = items.reduce((s, it) => s + it.qty, 0);
    if (sumTotal > 25) {
      errors.push(
        `總數 ${sumTotal} > 25：結帳時所有商品合計最多不得超過 25 個。`
      );
    }

    // random40
    const random40Sum = items
      .filter((i) => i.product.category === "random40")
      .reduce((s, i) => s + i.qty, 0);
    if (random40Sum > 5) {
      errors.push(`隨機系列40 類別總數 ${random40Sum} > 5（每人限購 5 個）。`);
    }

    // random15
    const random15Sum = items
      .filter((i) => i.product.category === "random15")
      .reduce((s, i) => s + i.qty, 0);
    if (random15Sum > 3) {
      errors.push(`隨機系列15 類別總數 ${random15Sum} > 3（每人限購 3 個）。`);
    }

    // extreme: 總數 <=3，且每款不得重複 (>1)
    const extremeItems = items.filter((i) => i.product.category === "extreme");
    const extremeSum = extremeItems.reduce((s, i) => s + i.qty, 0);
    if (extremeSum > 3) {
      errors.push(`極限量總數 ${extremeSum} > 3（每人限購 3 個）。`);
    }
    const extremeDup = extremeItems.filter((i) => i.qty > 1);
    if (extremeDup.length > 0) {
      errors.push(
        `極限量中以下品項購買數量不可超過 1：${extremeDup
          .map((i) => `${i.product.name}(${i.qty})`)
          .join(", ")}`
      );
    }

    // other: 每款 <=1
    const otherDup = items.filter(
      (i) => i.product.category === "other" && i.qty > 1
    );
    if (otherDup.length > 0) {
      errors.push(
        `其他品項中以下品項每人限購 1 件：${otherDup
          .map((i) => `${i.product.name}(${i.qty})`)
          .join(", ")}`
      );
    }

    return { valid: errors.length === 0, errors };
  }

  const validation = useMemo(() => validateCart(cartItems), [cartItems]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold">鬼滅百景｜購物數量計算器</h1>
      <div className="text-red-700 my-2">
        此網頁為粉絲自行製作，僅供參考，不保證完全正確，一切規則還請以官方公布內容為準。
      </div>
      <div className="text-subText my-2">
        商品清單感謝脆友{" "}
        <a
          href="https://www.threads.com/@iris_sy_du"
          target="blank"
          className="underline underline-offset-2"
        >
          @iris_sy_du
        </a>{" "}
        及{" "}
        <a
          href="https://www.threads.com/@kawaiii_1228"
          target="blank"
          className="underline underline-offset-2"
        >
          @kawaiii_1228
        </a>{" "}
        提供參考及使用！原文件網址
        <a
          href="https://docs.google.com/document/d/1mxL58ZN7Y-HBvRDCUsKSrvJZyDl8wEcVc_YauleMNA4/edit?usp=sharing"
          target="blank"
          className="underline underline-offset-2"
        >
          在此
        </a>
        ，裡面與有更多與展覽相關的介紹，非常用心！
      </div>
      <div className="text-subText my-2">
        隨機40款及15款盲抽的圖片皆來自
        <a
          href="https://www.ufotable.co.jp/kimetsu/event/hyakkei2025/"
          target="blank"
          className="underline underline-offset-2"
        >
          官網
        </a>
        。
      </div>
      <div className="text-subText my-2">
        業餘時間抽空製作，若有任何錯誤、不完整、可改善之處之可至
        <a
          href="https://www.threads.com/@miyu_murmur/post/DP4cS8JEtRv?xmt=AQF0dmE_ElHHq5yLcRjLZ_tw8qtqMTBRGLlrSqjLgN_9TQ"
          target="blank"
          className="underline underline-offset-2"
        >
          此篇脆文
        </a>
        下方留言回報，心有餘力時會盡量修改，請勿過度催促、惡意謾罵，謝謝大家！祝大家搶票/排隊順利、逛展愉快！
        <br />
        最後更新時間：2025/10/22 12:30
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {/* <div className="md:col-span-2"> */}
        <div className="md:col-span-2">
          <section className="mb-4">
            <h2 className="text-lg font-medium">商品清單</h2>
            <span className="text-subText text-xs">
              點擊圖片可在新視窗中察看
            </span>
            <div className="grid grid-cols-1  gap-3 mt-3">
              {series.map((s) => (
                <div key={s.key} className="border rounded p-3">
                  {/* 系列標題區 */}
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() =>
                      setExpanded((prev) => ({
                        ...prev,
                        [s.key]: !prev[s.key],
                      }))
                    }
                  >
                    <div className="flex flex-col">
                      <h2 className="font-bold text-lg">{s.name}</h2>
                      <div className="text-xs text-subText">
                        {s.key === "random40" && "此系列總上限 5（可重複）"}
                        {s.key === "random15" && "此系列總上限 3（可重複）"}
                        {s.key === "extreme" && "每款限 1，系列總上限 3"}
                        {s.key === "other" && "每款限 1"}
                      </div>
                    </div>

                    <button className="text-subText">
                      {expanded[s.key] ? "▲ 收起" : "▼ 展開"}
                    </button>
                  </div>

                  {/* 展開後的子商品列表 */}
                  {expanded[s.key] && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {s.items.map((item) => (
                        <div
                          key={item.name}
                          className="border rounded p-3 flex flex-col justify-between items-center"
                        >
                          <div className="font-medium">{item.name}</div>
                          {item.imageFile && (
                            <img
                              src={`/img/${item.imageFile}`}
                              alt={item.name}
                              className="w-24 h-24 object-contain mb-2"
                            />
                          )}
                          {item.imageUrl && (
                            <a href={item.imageUrl} target="blank">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-24 h-24 object-contain mb-2"
                              />
                            </a>
                          )}
                          <div className="text-sm pt-0.5 pb-1 text-subText">
                            {item?.price ? `$ ${item.price}` : "無價格資料"}
                          </div>
                          <button
                            className="px-3 py-1 rounded border hover:bg-gray-100 transition-transform duration-200 active:scale-95 hover:scale-110"
                            onClick={() => addToCart(item.id)}
                          >
                            加入
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section id="cart">
            <h2 className="text-lg font-medium">購物車</h2>
            {cartItems.length === 0 ? (
              <div className="mt-3 text-subText">購物車為空</div>
            ) : (
              <div className="mt-3 space-y-2">
                {cartItems.map((it) => (
                  <div
                    key={it.product.id}
                    className="flex items-center justify-between border rounded p-2"
                  >
                    <div>
                      <div className="font-medium">{it.product.name}</div>
                      <div className="text-xs text-hint">
                        {CATEGORY_LABELS[it.product.category]}
                      </div>
                      <div className="text-sm text-subtext">
                        {it.product.price
                          ? `$ ${it.product.price} 元`
                          : "無價格資料"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ">
                      <button
                        className="px-2 py-1 border rounded"
                        onClick={() => removeOne(it.product.id)}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className="w-16 text-center border rounded px-1 py-1"
                        value={it.qty}
                        min={1}
                        step={1}
                        onChange={
                          (e) => {
                            const value = Math.floor(Number(e.target.value)); // 只取整數
                            const safeValue =
                              isNaN(value) || value < 1 ? 1 : value; // 限制至少為 1
                            setQty(it.product.id, safeValue);
                          }
                          // setQty(
                          //   it.product.id,
                          //   Math.max(0, Number(e.target.value))
                          // )
                        }
                      />
                      <button
                        className="px-2 py-1 border rounded"
                        onClick={() => setQty(it.product.id, it.qty + 1)}
                      >
                        +
                      </button>
                      <button
                        className="px-2 py-1 border rounded bg-red-500 text-white hover:bg-red-600"
                        onClick={() => setQty(it.product.id, 0)}
                      >
                        刪除
                      </button>
                    </div>
                  </div>
                ))}
                <div className="text-sm text-subText">
                  總數：{cartItems.reduce((s, i) => s + i.qty, 0)} 件
                </div>
                <div className="text-sm text-subText">
                  總金額：{totalAmount} 元
                </div>
                <div className="text-sm text-red-700">
                  注意！總金額未包含無價格資料之商品！
                </div>
              </div>
            )}
          </section>
          <FloatingCart totalItems={cartItems.reduce((s, i) => s + i.qty, 0)} />
        </div>

        <aside className="border rounded p-4">
          <h3 className="text-lg font-medium">檢查結果</h3>
          <div className="mt-3">
            {validation.valid ? (
              <div className="text-green-700 font-medium">
                ✔ 符合所有購買規則
              </div>
            ) : (
              <div>
                <div className="text-red-700 font-medium mb-2">✖ 發現違規</div>
                <ul className="list-disc pl-5 text-sm text-red-600">
                  {validation.errors.map((e, idx) => (
                    <li key={idx}>{e}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-4">
            <h4 className="font-medium">快速檢視</h4>
            <div className="text-sm mt-2">
              <div>
                隨機系列40：已選{" "}
                {cartItems
                  .filter((i) => i.product.category === "random40")
                  .reduce((s, i) => s + i.qty, 0)}{" "}
                / 5
              </div>
              <div>
                隨機系列15：已選{" "}
                {cartItems
                  .filter((i) => i.product.category === "random15")
                  .reduce((s, i) => s + i.qty, 0)}{" "}
                / 3
              </div>
              <div>
                極限量：已選{" "}
                {cartItems
                  .filter((i) => i.product.category === "extreme")
                  .reduce((s, i) => s + i.qty, 0)}{" "}
                / 3（且每款 ≤1）
              </div>
              <div>其他品項：每款限 1 件</div>
              <div className="mt-2 font-medium">
                總數量：{cartItems.reduce((s, i) => s + i.qty, 0)} / 25
              </div>
            </div>
          </div>

          {/* <div className="mt-4">
            <button
              onClick={() => {
                // 匯出目前購物車 JSON（範例）
                const exportData = cartItems.map((i) => ({
                  id: i.product.id,
                  name: i.product.name,
                  category: i.product.category,
                  qty: i.qty,
                }));
                const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "cart.json";
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="px-3 py-2 bg-blue-600 text-white rounded"
            >
              匯出購物車 JSON
            </button>
          </div> */}
        </aside>
      </div>

      <footer className="mt-6 text-sm text-subText">
        <div>
          此網頁為粉絲自行製作，非官方提供，不保證完全正確，一切規則還請以官方公布內容為準。
        </div>
      </footer>
    </div>
  );
}
