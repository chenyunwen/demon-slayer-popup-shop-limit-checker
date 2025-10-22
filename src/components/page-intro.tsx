"use client";
import React from "react";

export default function PageIntro() {
  return (
    <div className="w-full">
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
        圖片來源自
        <a
          href="https://www.ufotable.co.jp/kimetsu/event/hyakkei2025/"
          target="blank"
          className="underline underline-offset-2"
        >
          鬼滅百景官網
        </a>
        、
        <a
          href="https://webshop.ufotable.co.jp/products"
          target="blank"
          className="underline underline-offset-2"
        >
          ufotableWEBSHOP
        </a>
        、
        <a
          href="https://webshop-global.ufotable.co.jp/"
          target="blank"
          className="underline underline-offset-2"
        >
          ufotableWEBSHOP-Global - ufotable Official Store
        </a>
        、
        <a
          href="https://x.com/ufotablecinema"
          target="blank"
          className="underline underline-offset-2"
        >
          @ufotablecinema
        </a>
        ，
        <span className="font-bold">
          有的品項只先找一兩個做代表，圖片不代表現場有/沒有該角色
        </span>
        ，一切皆以現場為主，若有圖片與品項搭配錯誤的情形可向我回報。
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
        最後更新時間：2025/10/23 3:10
      </div>
    </div>
  );
}
