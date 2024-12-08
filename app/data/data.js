// Sample data
export const sampleProducts = [
  {
    id: 1,
    name: "Wireless Headphones",
    description:
      "Premium noise-canceling wireless headphones with 30-hour battery life, perfect for immersive audio experience.",
    price: 299.99,
    image: "/image.jpeg",
    category: "electronics",
    rating: 4.5,
    isLiked: false,
    specs: [
      "Bluetooth 5.0",
      "Active Noise Cancellation",
      "30hr Battery",
      "Quick Charge",
    ],
    stock: 15,
  },
  {
    id: 2,
    name: "Smart Watch Pro",
    description:
      "Advanced smartwatch with health tracking, GPS, and seamless smartphone integration.",
    price: 199.99,
    image: "/image.jpeg",
    category: "electronics",
    rating: 4.8,
    isLiked: false,
    specs: [
      "Heart Rate Monitor",
      "GPS",
      "5ATM Water Resistant",
      "7-day Battery",
    ],
    stock: 8,
  },
  {
    id: 3,
    name: "Cotton T-Shirt",
    description:
      "Comfortable 100% organic cotton t-shirt, perfect for everyday wear.",
    price: 24.99,
    image: "/image.jpeg",
    category: "clothing",
    rating: 4.3,
    isLiked: false,
    specs: [
      "100% Organic Cotton",
      "Machine Washable",
      "Sustainable",
      "Multiple Colors",
    ],
    stock: 50,
  },
  {
    id: 4,
    name: "Leather Wallet",
    description:
      "Genuine leather wallet with RFID protection and multiple card slots.",
    price: 49.99,
    image: "/image.jpeg",
    category: "accessories",
    rating: 4.6,
    isLiked: false,
    specs: [
      "Genuine Leather",
      "RFID Protection",
      "6 Card Slots",
      "Coin Pocket",
    ],
    stock: 25,
  },
];

export const sampleCategories = [
  { id: "electronics", name: "Electronics", icon: "🎧" },
  { id: "clothing", name: "Clothing", icon: "👕" },
  { id: "accessories", name: "Accessories", icon: "👜" },
  { id: "home", name: "Home & Kitchen", icon: "🏠" },
  { id: "sports", name: "Sports & Fitness", icon: "🏃" },
];
