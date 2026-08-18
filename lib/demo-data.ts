import { Product } from "./types";

export const products: Product[] = [
  { id: "p1", title: "Cropped Cloud Jacket", brand: "Alo Yoga", price: 148, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85", category: "Outerwear", source: "affiliate", affiliateUrl: "https://example.com", match: 98, colors: ["#1d1d1d", "#d8d1c9"] },
  { id: "p2", title: "Samba OG", brand: "Adidas", price: 100, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=85", category: "Sneakers", source: "affiliate", affiliateUrl: "https://example.com", match: 96, colors: ["#ece8dc", "#202020"] },
  { id: "p3", title: "Ribbed Column Dress", brand: "Reformation", price: 218, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=85", category: "Dresses", source: "native", match: 94, colors: ["#9b271f", "#202020"] },
  { id: "p4", title: "Mini Jodie Bag", brand: "Bottega Veneta", price: 2650, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85", category: "Bags", source: "affiliate", affiliateUrl: "https://example.com", match: 91, colors: ["#8d4a2f", "#e4d7c5"] },
  { id: "p5", title: "Oversized Poplin Shirt", brand: "HAUL Studio", price: 89, image: "https://images.unsplash.com/photo-1605763240000-7e93b172d754?auto=format&fit=crop&w=900&q=85", category: "Tops", source: "native", match: 89, colors: ["#e6e7e9", "#aac7df"] }
];

export const posts = [
  { id: "post1", author: "Maya Chen", handle: "@mayamoves", avatar: "MC", image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=85", caption: "Coffee run, but make it a look ☕️", likes: 2481, product: products[0] },
  { id: "post2", author: "Jordan Ellis", handle: "@jordanedit", avatar: "JE", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=85", caption: "Neutral layers forever.", likes: 1094, product: products[1] }
];
