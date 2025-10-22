import React from "react";
import { ProductSeries } from "@/constants";
import ProductItemCard from "./product-item-card";

interface Props {
  series: ProductSeries[];
  expanded: Record<string, boolean>;
  setExpanded: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  addToCart: (name: string) => void;
}

export default function ProductSeriesList({
  series,
  expanded,
  setExpanded,
  addToCart,
}: Props) {
  return (
    <section className="mb-4">
      <h2 className="text-lg font-medium">商品清單</h2>
      <span className="text-subText text-xs">點擊圖片可在新視窗中察看</span>
      <div className="grid grid-cols-1 gap-3 mt-3">
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
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {s.items.map((item, index) => (
                  <ProductItemCard
                    key={item.name}
                    item={item}
                    index={index}
                    addToCart={addToCart}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
