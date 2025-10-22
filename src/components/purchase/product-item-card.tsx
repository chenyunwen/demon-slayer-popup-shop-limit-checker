import React from "react";
import { Product } from "@/constants";

interface Props {
  item: Product;
  addToCart: (name: string) => void;
}

export default function ProductItemCard({ item, addToCart }: Props) {
  return (
    <div className="border rounded p-3 flex flex-col justify-between items-center">
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
        onClick={() => addToCart(item.name)}
      >
        加入
      </button>
    </div>
  );
}
