"use client";
import React, { useMemo, useState } from "react";

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

// 規則1️⃣ 🔸 隨機系列商品
// ・共40款的系列：每人限購 5個
// ✅可以：任意挑選5個品項，角色可以重複
// ❌不可以：購買超過5個

// ・共15款的系列：每人限購 3個
// ✅可以：任意挑選3個品項，角色可以重複挑選
// ❌不可以：購買超過3個 規則2️⃣

// 🔸 極限量商品 每人限購 3個，且品項不得重複
// ✅可以：挑選3種不同的極限量商品各1個
// ❌不可以：購買同一款極限量商品2個以上

// 🔸 其他品項 每人限購 1個
// ✅可以：各品項各購買1個
// ❌不可以：同一商品購買2個以上

// 規則3️⃣ ✨ 結帳時所有商品合計最多不得超過25個。
// ✅可以：各品項依限購數量選購，總數25個以內
// ❌不可以：即使各品項皆未超限，總數仍超過25個

// 範例商品（少量示範）
const SAMPLE_PRODUCTS = (() => {
  const products: Product[] = [];
  // random40: 產生 8 個示範（實際可擴充到 40）
  for (let i = 1; i <= 8; i++) {
    products.push({
      id: `R40-${i}`,
      name: `隨機系列40 #${i}`,
      category: "random40",
    });
  }
  // random15: 產生 5 個示範（實際可擴充到 15）
  for (let i = 1; i <= 5; i++) {
    products.push({
      id: `R15-${i}`,
      name: `隨機系列15 #${i}`,
      category: "random15",
    });
  }
  // extreme: 5 款極限量示範
  for (let i = 1; i <= 5; i++) {
    products.push({
      id: `E-${i}`,
      name: `極限量 #${i}`,
      category: "extreme",
    });
  }
  // other: 一些其他品項
  for (let i = 1; i <= 6; i++) {
    products.push({
      id: `O-${i}`,
      name: `其他品項 #${i}`,
      category: "other",
    });
  }
  return products;
})();

type Category = "random40" | "random15" | "extreme" | "other";

type Product = {
  id: string;
  name: string;
  category: Category;
};

type CartItem = {
  product: Product;
  qty: number;
};

export default function PurchaseRuleChecker() {
  const [products] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [cart, setCart] = useState<Record<string, number>>({});

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
    return Object.entries(cart).map(([id, qty]) => ({
      product: products.find((p) => p.id === id)!,
      qty,
    }));
  }, [cart, products]);

  // 驗證邏輯
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
            <h2 className="text-lg font-medium">商品清單（範例）</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="border rounded p-3 flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-sm text-gray-600">
                      類別：{p.category}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="px-2 py-1 rounded border"
                      onClick={() => addToCart(p.id)}
                    >
                      加入
                    </button>
                  </div>
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
