import React, { useMemo } from "react";
import { CartItem, CATEGORY_LABELS } from "@/constants";

interface Props {
  cartItems: CartItem[];
  setQty: (name: string, qty: number) => void;
  removeOne: (name: string) => void;
}

export default function CartSection({ cartItems, setQty, removeOne }: Props) {
  // 💰 總金額
  const totalAmount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  }, [cartItems]);

  return (
    <section id="cart">
      <h2 className="text-lg font-medium">購物車</h2>
      {cartItems.length === 0 ? (
        <div className="mt-3 text-subText">購物車為空</div>
      ) : (
        <div className="mt-3 space-y-2">
          {cartItems.map((it) => (
            <div
              key={it.product.name}
              className="flex items-center justify-between border rounded p-2"
            >
              <div>
                <div className="font-medium">{it.product.name}</div>
                <div className="text-xs text-hint">
                  {CATEGORY_LABELS[it.product.category]}
                </div>
                <div className="text-sm text-subtext">
                  {it.product.price ? `$ ${it.product.price} 元` : "無價格資料"}
                </div>
              </div>
              <div className="flex items-center gap-2 ">
                <button
                  className="px-2 py-1 border rounded"
                  onClick={() => removeOne(it.product.name)}
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
                      const safeValue = isNaN(value) || value < 1 ? 1 : value; // 限制至少為 1
                      setQty(it.product.name, safeValue);
                    }
                    // setQty(
                    //   it.product.id,
                    //   Math.max(0, Number(e.target.value))
                    // )
                  }
                />
                <button
                  className="px-2 py-1 border rounded"
                  onClick={() => setQty(it.product.name, it.qty + 1)}
                >
                  +
                </button>
                <button
                  className="px-2 py-1 border rounded bg-red-500 text-white hover:bg-red-600"
                  onClick={() => setQty(it.product.name, 0)}
                >
                  刪除
                </button>
              </div>
            </div>
          ))}
          <div className="text-sm text-subText">
            總數：{cartItems.reduce((s, i) => s + i.qty, 0)} 件
          </div>
          <div className="text-sm text-subText">總金額：{totalAmount} 元</div>
          <div className="text-sm text-red-700">
            注意！總金額未包含無價格資料之商品！
          </div>
        </div>
      )}
    </section>
  );
}
