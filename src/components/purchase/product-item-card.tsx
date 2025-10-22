import Image from "next/image";
import React, { useState } from "react";
import { Product } from "@/constants";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Props {
  item: Product;
  index: number;
  addToCart: (name: string) => void;
}

export default function ProductItemCard({ item, index, addToCart }: Props) {
  const images = Array.isArray(item.imageUrl)
    ? item.imageUrl
    : item.imageUrl
    ? [item.imageUrl]
    : [];

  return (
    <div className="border rounded p-3 flex flex-col justify-between items-center">
      <div className="font-medium">{item.name}</div>
      {item.imageFile && (
        <Image
          src={`/img/${item.imageFile}`}
          alt={item.name}
          width={1000}
          height={1000}
          className="w-24 h-24 object-contain mb-2"
        />
      )}
      {item.imageUrl && (
        <div className="relative flex items-center justify-center w-full">
          <div className="w-[70%] h-auto aspect-square mb-2">
            <Swiper
              loop={true}
              modules={[Navigation, Pagination]}
              navigation={{
                // prevEl: ".swiper-button-prev",
                // nextEl: ".swiper-button-next",
                prevEl: `.${item.category}-${index}-prev`,
                nextEl: `.${item.category}-${index}-next`,
              }}
              pagination={{
                clickable: true,
              }}
              spaceBetween={10}
              // className="h-full"
            >
              {images.map((url, index) => (
                <SwiperSlide key={index}>
                  <div
                    className={`flex flex-col items-center ${
                      item.imageUrl && item.imageUrl?.length > 1 && "pb-8"
                    } `}
                  >
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-grow flex items-center justify-center w-full"
                    >
                      <Image
                        src={url}
                        alt={`${item.name}-${index + 1}`}
                        width={1000}
                        height={1000}
                        className="w-full h-fit object-contain rounded-md border border-gray-200"
                      />
                    </a>
                    <div>{item.imageName && item.imageName[index]}</div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <button
            className={`${item.category}-${index}-prev swiper-button-prev absolute -left-6 transition`}
            aria-label="上一張"
          />
          <button
            className={`${item.category}-${index}-next swiper-button-next absolute -right-6 transition`}
            aria-label="下一張"
          />
        </div>
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
