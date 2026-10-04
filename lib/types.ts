export type Gender = "men" | "women";

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  gender: Gender;
  category: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  imageAlt: string;
  colors: ProductColor[];
  sizes: string[];
  description: string;
  details: string[];
  rating: number;
  reviews: number;
  isNew?: boolean;
  /** lower number = shown earlier in the default "featured" sort */
  rank: number;
}

export interface CartLine {
  productId: string;
  size: string;
  color: string;
  qty: number;
}

export interface CartLineView extends CartLine {
  product: Product;
  lineTotal: number;
}
