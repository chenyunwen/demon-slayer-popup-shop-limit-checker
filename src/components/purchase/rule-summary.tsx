import React from "react";
import { CartItem } from "@/constants";

export default function RuleSummary({ cartItems }: { cartItems: CartItem[] }) {
  return (
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
  );
}
