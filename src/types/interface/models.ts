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
