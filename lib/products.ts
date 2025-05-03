// Define the product type
export interface Product {
  tag: string;
  rating: number;
  reviews: number;
  price: number;
}

// Export products as objects with proper typing
export const products = {
  house1: {
    tag: "House For Rent",
    rating: 4.95,
    reviews: 22,
    price: 145789,
  },
  car1: {
    tag: "Car For Sale",
    rating: 4.25,
    reviews: 22,
    price: 145668,
  },
  house2: {
    tag: "House For Rent",
    rating: 3.95,
    reviews: 22,
    price: 120000,
  },
  car2: {
    tag: "Car For Sale",
    rating: 4.6,
    reviews: 22,
    price: 13000,
  },
  car3: {
    tag: "Car For Sale",
    rating: 4.3,
    reviews: 22,
    price: 8900,
  },
  placeholder: {
    tag: "Home",
    rating: 0,
    reviews: 0,
    price: 99900,
  },
};

// Export a function to safely get a product
export const getProduct = (key: keyof typeof products): Product => {
  return products[key] || products.placeholder;
};
