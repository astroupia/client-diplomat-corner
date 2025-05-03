"use server";

import { connectToDatabase } from "@/lib/db-connect";
import Review from "@/lib/models/review.model";
import mongoose from "mongoose";
import { z } from "zod";
import {
  CreateReviewInput,
  UpdateReviewInput,
  ReviewResponse,
} from "@/types/reviews";
import { revalidatePath } from "next/cache";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Phone number must be at least 8 digits"),
  subject: z.enum(["General Inquiry", "Advert has errors", "Want admin"]),
  message: z.string().min(1, "Message is required"),
});

export async function submitContactForm(formData: FormData) {
  const data = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    subject: formData.get("subject") as string,
    message: formData.get("message") as string,
  };

  try {
    await connectToDatabase();
    const validatedData = contactSchema.parse(data);
    const contact = new Review(validatedData);
    const savedContact = await contact.save();

    return {
      success: true,
      message: "Contact form submitted successfully",
      id: savedContact._id.toString(),
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation failed",
        errors: error.errors,
      };
    }
    if (error instanceof mongoose.Error) {
      return {
        success: false,
        message: "Database error occurred",
        error: error.message,
      };
    }
    console.error("Error in server action:", error);
    return {
      success: false,
      message: "Internal server error",
    };
  }
}

export async function createReview(
  input: CreateReviewInput,
  userId: string
): Promise<ReviewResponse> {
  try {
    await connectToDatabase();

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      userId,
      productId: input.productId,
    });

    if (existingReview) {
      return {
        success: false,
        message: "You have already reviewed this product",
      };
    }

    const review = await Review.create({
      ...input,
      userId,
      likes: 0,
    });

    revalidatePath(`/car/${input.productId}`);

    return {
      success: true,
      message: "Review created successfully",
      data: review,
    };
  } catch (error) {
    console.error("Error creating review:", error);
    return {
      success: false,
      message: "Failed to create review",
    };
  }
}

export async function updateReview(
  reviewId: string,
  input: UpdateReviewInput,
  userId: string
): Promise<ReviewResponse> {
  try {
    await connectToDatabase();

    const review = await Review.findById(reviewId);

    if (!review) {
      return {
        success: false,
        message: "Review not found",
      };
    }

    if (review.userId.toString() !== userId) {
      return {
        success: false,
        message: "You are not authorized to update this review",
      };
    }

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { ...input },
      { new: true }
    );

    revalidatePath(`/car/${review.productId}`);

    return {
      success: true,
      message: "Review updated successfully",
      data: updatedReview,
    };
  } catch (error) {
    console.error("Error updating review:", error);
    return {
      success: false,
      message: "Failed to update review",
    };
  }
}

export async function deleteReview(
  reviewId: string,
  userId: string
): Promise<ReviewResponse> {
  try {
    await connectToDatabase();

    const review = await Review.findById(reviewId);

    if (!review) {
      return {
        success: false,
        message: "Review not found",
      };
    }

    if (review.userId.toString() !== userId) {
      return {
        success: false,
        message: "You are not authorized to delete this review",
      };
    }

    await Review.findByIdAndDelete(reviewId);

    revalidatePath(`/car/${review.productId}`);

    return {
      success: true,
      message: "Review deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting review:", error);
    return {
      success: false,
      message: "Failed to delete review",
    };
  }
}

export async function getReviewsByProduct(
  productId: string
): Promise<ReviewResponse> {
  try {
    await connectToDatabase();

    const reviews = await Review.find({ productId })
      .populate("user", "username imageUrl")
      .sort({ createdAt: -1 });

    return {
      success: true,
      message: "Reviews fetched successfully",
      data: reviews,
    };
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return {
      success: false,
      message: "Failed to fetch reviews",
    };
  }
}

export async function likeReview(
  reviewId: string,
  userId: string
): Promise<ReviewResponse> {
  try {
    await connectToDatabase();

    const review = await Review.findById(reviewId);

    if (!review) {
      return {
        success: false,
        message: "Review not found",
      };
    }

    // Check if user has already liked this review
    const hasLiked = review.likes.includes(userId);

    if (hasLiked) {
      // Unlike the review
      review.likes = review.likes.filter(
        (id: string) => id.toString() !== userId
      );
    } else {
      // Like the review
      review.likes.push(userId);
    }

    await review.save();

    revalidatePath(`/car/${review.productId}`);

    return {
      success: true,
      message: hasLiked
        ? "Review unliked successfully"
        : "Review liked successfully",
      data: review,
    };
  } catch (error) {
    console.error("Error liking review:", error);
    return {
      success: false,
      message: "Failed to like review",
    };
  }
}
