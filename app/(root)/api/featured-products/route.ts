import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db-connect";
import Review from "@/lib/models/review.model";
import Car from "@/lib/models/car.model";
import House from "@/lib/models/house.model";

// Type for the featured product response
interface FeaturedProduct {
  _id: string;
  productId: string;
  type: "car" | "house";
  name: string;
  price: number;
  advertisementType: string;
  imageUrl: string;
  averageRating: number;
  totalReviews: number;
  totalLikes: number;
}

// Default expiry time of 24 hours (in seconds)
const CACHE_EXPIRY = 86400;

export async function GET() {
  try {
    await connectToDatabase();

    // Get all reviews
    const reviews = await Review.find().lean();

    // Group reviews by productId and calculate average rating
    const productRatings = new Map();
    const productLikes = new Map();

    reviews.forEach((review) => {
      // Count reviews per product
      if (!productRatings.has(review.productId)) {
        productRatings.set(review.productId, { sum: 0, count: 0 });
        productLikes.set(review.productId, 0);
      }

      const product = productRatings.get(review.productId);
      product.sum += review.rating;
      product.count += 1;

      // Count likes
      productLikes.set(
        review.productId,
        productLikes.get(review.productId) +
          (review.likes ? review.likes.length : 0)
      );
    });

    // Calculate average rating for each product
    const productsWithRatings = [];

    for (const [productId, { sum, count }] of productRatings.entries()) {
      if (count > 0) {
        const averageRating = sum / count;
        productsWithRatings.push({
          productId,
          averageRating,
          totalReviews: count,
          totalLikes: productLikes.get(productId) || 0,
        });
      }
    }

    // Sort by average rating (descending)
    productsWithRatings.sort((a, b) => b.averageRating - a.averageRating);

    // Take top 10 products
    const topProducts = productsWithRatings.slice(0, 10);

    // Fetch product details
    const featuredProducts: FeaturedProduct[] = [];

    // Create a batch operation for efficient querying
    for (const product of topProducts) {
      // Try to find in cars
      const car = await Car.findOne({ _id: product.productId }).lean();
      if (car) {
        featuredProducts.push({
          _id: car._id,
          productId: car._id,
          type: "car",
          name: car.name,
          price: car.price,
          advertisementType: car.advertisementType,
          imageUrl: car.imageUrl || "/placeholder.svg",
          averageRating: product.averageRating,
          totalReviews: product.totalReviews,
          totalLikes: product.totalLikes,
        });
        continue;
      }

      // Try to find in houses
      const house = await House.findOne({ _id: product.productId }).lean();
      if (house) {
        featuredProducts.push({
          _id: house._id,
          productId: house._id,
          type: "house",
          name: house.name,
          price: house.price,
          advertisementType: house.advertisementType,
          imageUrl: house.imageUrl || "/placeholder.svg",
          averageRating: product.averageRating,
          totalReviews: product.totalReviews,
          totalLikes: product.totalLikes,
        });
      }
    }

    // Return the featured products with Cache-Control header
    return NextResponse.json(featuredProducts, {
      headers: {
        "Cache-Control": `public, max-age=${CACHE_EXPIRY}, s-maxage=${CACHE_EXPIRY}`,
      },
    });
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured products" },
      { status: 500 }
    );
  }
}
