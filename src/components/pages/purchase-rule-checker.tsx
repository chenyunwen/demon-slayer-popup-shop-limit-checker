"use client";
import React, { useMemo, useState } from "react";
import sampleSeries from "@/../public/products.json";

const SAMPLE_SERIES = sampleSeries as ProductSeries[];
// 資料與程式說明 (繁體中文註解)
// - 單檔 React + TypeScript 範例，可放在 Next.js 或 Create React App 中。
// - 使用 Tailwind CSS class 作為樣式（如未安裝可自行改為一般 class）。
// - 功能：範例商品清單、加入購物車、數量調整、即時檢查是否違反規則，並顯示違規原因。

// 規則回顧：
// 規則1️⃣ 隨機系列商品
// ・random40 (共40款)：每人限購 5 個（可重複同款）
// ・random15 (共15款)：每人限購 3 個（可重複同款）
// 規則2️⃣
// ・extreme（極限量）：每人限購 3 個，且品項不得重複（同款數量 <=1）
// ・other（其他品項）：每人限購 1 個（每款 <=1）
// 規則3️⃣
// ・結帳總數量最多不得超過 25 個

type Category = "random40" | "random15" | "extreme" | "other";

type Product = {
  id: string;
  name: string;
  category: Category;
  imageFile?: string;
};

type ProductSeries = {
  key: Category;
  name: string;
  limit: number;
  items: Product[];
};

type CartItem = {
  product: Product;
  qty: number;
};

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
      .map(([id, qty]) => {
        const p = flatProducts.find((fp) => fp.id === id);
        if (!p) return null;
        return { product: p, qty };
      })
      .filter((x): x is CartItem => x !== null);
  }, [cart, flatProducts]);

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
      <h1 className="text-2xl font-semibold mb-4">購物限購檢查器</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <section className="mb-4">
            <h2 className="text-lg font-medium">商品清單</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
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
                      <div className="text-xs text-gray-500">
                        {s.key === "random40" && "此系列總上限 5（可重複）"}
                        {s.key === "random15" && "此系列總上限 3（可重複）"}
                        {s.key === "extreme" && "每款限 1，系列總上限 3"}
                        {s.key === "other" && "每款限 1"}
                      </div>
                    </div>

                    <span className="text-gray-500">
                      {expanded[s.key] ? "▲ 收起" : "▼ 展開"}
                    </span>
                  </div>

                  {/* 展開後的子商品列表 */}
                  {expanded[s.key] && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {s.items.map((item) => (
                        <div
                          key={item.id}
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
                          <button
                            className="px-3 py-1 rounded border hover:bg-gray-100"
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

          <section>
            <h2 className="text-lg font-medium">購物車</h2>
            {cartItems.length === 0 ? (
              <div className="mt-3 text-gray-600">購物車為空</div>
            ) : (
              <div className="mt-3 space-y-2">
                {cartItems.map((it) => (
                  <div
                    key={it.product.id}
                    className="flex items-center justify-between border rounded p-2"
                  >
                    <div>
                      <div className="font-medium">{it.product.name}</div>
                      <div className="text-sm text-gray-600">
                        {it.product.category}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="px-2 py-1 border rounded"
                        onClick={() => removeOne(it.product.id)}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className="w-16 text-center border rounded px-1"
                        value={it.qty}
                        min={0}
                        onChange={(e) =>
                          setQty(
                            it.product.id,
                            Math.max(0, Number(e.target.value))
                          )
                        }
                      />
                      <button
                        className="px-2 py-1 border rounded"
                        onClick={() => setQty(it.product.id, it.qty + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
                <div className="text-sm text-gray-700">
                  總數：{cartItems.reduce((s, i) => s + i.qty, 0)} 件
                </div>
              </div>
            )}
          </section>
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
            </div>
          </div>

          <div className="mt-4">
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
          </div>
        </aside>
      </div>

      <footer className="mt-6 text-sm text-gray-600">
        <div>
          說明：此範例著重前端檢查邏輯。正式上線應在後端再次驗證，以避免使用者繞過前端規則。
        </div>
      </footer>
    </div>
  );
}
