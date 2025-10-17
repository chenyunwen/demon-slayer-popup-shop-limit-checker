// 規則回顧：
//
// 規則1️⃣ 隨機系列商品
// ・random40 (共40款)：每人限購 5 個（可重複同款）
// ・random15 (共15款)：每人限購 3 個（可重複同款）
// 規則2️⃣
// ・extreme（極限量）：每人限購 3 個，且品項不得重複（同款數量 <=1）
// ・other（其他品項）：每人限購 1 個（每款 <=1）
// 規則3️⃣
// ・結帳總數量最多不得超過 25 個

export type Category = "random40" | "random15" | "extreme" | "other";

export const CATEGORY_LABELS: Record<Category, string> = {
  random40: "隨機系列 40",
  random15: "隨機系列 15",
  extreme: "極限量商品",
  other: "其他品項",
};

export type Product = {
  id: string;
  name: string;
  category: Category;
  price?: number;
  imageFile?: string;
};

export type ProductSeries = {
  key: Category;
  name: string;
  limit: number;
  items: Product[];
};

export type CartItem = {
  product: Product;
  qty: number;
  subtotal: number;
};

// export type SceneType = keyof typeof SCENE;

// export const waitTime = 5000; // 5 seconds
// export const maxWaitTime = 5000; // 5 seconds
