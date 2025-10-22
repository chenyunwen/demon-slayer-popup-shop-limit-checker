import React, { useMemo } from "react";
import { CartItem } from "@/constants";
import RuleSummary from "./rule-summary";

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

export default function ValidationPanel({
  cartItems,
}: {
  cartItems: CartItem[];
}) {
  const validation = useMemo(() => validateCart(cartItems), [cartItems]);

  return (
    <aside className="border rounded p-4">
      <h3 className="text-lg font-medium">檢查結果</h3>
      <div className="mt-3">
        {validation.valid ? (
          <div className="text-green-700 font-medium">✔ 符合所有購買規則</div>
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

      <RuleSummary cartItems={cartItems} />

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
  );
}
