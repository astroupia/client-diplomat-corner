// Define the image type
export interface ImageAsset {
  src: string;
  alt: string;
}

// Export images as objects with proper typing
export const images = {
  air: {
    src: "/assets/images/air.jpg",
    alt: "Air view",
  },
  air2: {
    src: "/assets/images/air2.jpg",
    alt: "Air view 2",
  },
  building: {
    src: "/assets/images/building.jpg",
    alt: "Building",
  },
  cash: {
    src: "/assets/images/cash.jpg",
    alt: "Cash",
  },
  car: {
    src: "/assets/images/car.jpg",
    alt: "Car",
  },
  half: {
    src: "/assets/images/half.jpg",
    alt: "Half view",
  },
  women: {
    src: "/assets/images/women.jpg",
    alt: "Women",
  },
  placeholder: {
    src: "/assets/images/placeholder.jpg",
    alt: "Placeholder",
  },
  house_preview: {
    src: "./house_preview.jpg",
    alt: "preview house",
  },
  car_preview: {
    src: "./car_preview.jpg",
    alt: "preview house",
  },
  dashen: {
    src: "/assets/images/dashen.jpg",
    alt: "dashen",
  },
  awash: {
    src: "/assets/images/awash.jpg",
    alt: "awash",
  },
};

// Export a function to safely get an image
export const getImage = (key: keyof typeof images): ImageAsset => {
  return images[key] || images.placeholder;
};
