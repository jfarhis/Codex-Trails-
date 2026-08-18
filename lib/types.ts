export type ProductSource = "native" | "affiliate" | "shopify_import";

export type Product = {
  id: string;
  title: string;
  brand: string;
  price: number;
  image: string;
  category: string;
  source: ProductSource;
  affiliateUrl?: string;
  match: number;
  colors: string[];
};

export type Tab = "home" | "swipe" | "stylist" | "bag" | "profile";
