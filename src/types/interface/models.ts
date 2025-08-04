export interface IProduct {
  _id: string;
  title: string;
  slug: string;
  price: number;
  images: string[];
  salePercent: number;
  isSale: boolean;
  category: string[];
  rating: number;
  colors: string[];
  isVisible: boolean;
  shortDesc: string;
  longDesc: string;
  updatedAt: Date;
  createdAt: Date;
}

export interface ICartItem {
  slug: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  inStock: boolean;
}
export interface ICart {
  items: ICartItem[];
  totalItems: number;
  subtotal: number;
  discount: number;
  total: number;
}