import { connectToDatabase } from "@/lib/db-connect";
import Car, { ICar } from "@/lib/models/car.model";
import { NextRequest, NextResponse } from "next/server";
import Payment from "@/lib/models/payment.model";
import { auth } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";

const CPANEL_API_URL = process.env.NEXT_PUBLIC_CPANEL_API_URL;
const CPANEL_USERNAME = process.env.NEXT_PUBLIC_CPANEL_USERNAME;
const CPANEL_API_TOKEN = process.env.NEXT_PUBLIC_CPANEL_API_TOKEN;
const PUBLIC_DOMAIN = process.env.NEXT_PUBLIC_PUBLIC_DOMAIN;

interface ApiResponse {
  success: boolean;
  error?: string;
  message?: string;
  carId?: string;
  paymentId?: string;
  cars?: ICar[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

interface CarQuery {
  userId?: string | { $ne: string };
  advertisementType?: string;
  status: "Active" | "Pending";
}

async function uploadImage(
  file: File,
  folder: "public_images" | "receipts"
): Promise<{ success: boolean; publicUrl?: string; error?: string }> {
  const extension = file.name.split(".").pop();
  const randomFileName = `${uuidv4()}.${extension}`;

  const uploadFolder =
    folder === "receipts" ? "public_images/receipts" : folder;

  const apiFormData = new FormData();
  apiFormData.append("dir", `/public_html/${uploadFolder}/`);
  apiFormData.append("file-1", file, randomFileName);

  const authHeader = `cpanel ${CPANEL_USERNAME}:${
    CPANEL_API_TOKEN?.trim() || ""
  }`;

  try {
    const response = await fetch(
      `${CPANEL_API_URL}/execute/Fileman/upload_files`,
      {
        method: "POST",
        headers: { Authorization: authHeader },
        body: apiFormData,
      }
    );

    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      const errorText = await response.text();
      console.error("cPanel API error response:", errorText);
      return {
        success: false,
        error: `Upload failed: ${response.status} ${response.statusText}`,
      };
    }

    // Try to parse JSON response
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error("Failed to parse JSON response:", jsonError);
      const responseText = await response.text();
      console.error("Response text:", responseText);
      return {
        success: false,
        error: "Invalid response from upload service",
      };
    }

    if (data.status === 0) {
      return {
        success: false,
        error: data.errors?.join(", ") || "Upload failed",
      };
    }

    const uploadedFile = data.data?.uploads[0];
    if (!uploadedFile || !uploadedFile.file) {
      return { success: false, error: "No uploaded file details returned" };
    }

    const publicUrl = `${PUBLIC_DOMAIN}/${uploadFolder}/${uploadedFile.file}`;
    return { success: true, publicUrl };
  } catch (error) {
    console.error("Image upload error:", error);
    return { success: false, error: "Failed to upload image" };
  }
}

export async function GET(
  req: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const userId = searchParams.get("userId");
    const excludeUserId = searchParams.get("excludeUserId");
    const advertisementType = searchParams.get("advertisementType");

    await connectToDatabase();

    // Build the query
    const query: CarQuery = {
      status: "Active",
    };

    // Add filters
    if (userId) {
      query.userId = userId;
    }
    if (excludeUserId) {
      query.userId = { $ne: excludeUserId };
    }
    if (advertisementType) {
      query.advertisementType = advertisementType;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await Car.countDocuments(query);

    // Fetch cars with pagination
    const cars = await Car.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      success: true,
      cars,
      pagination: {
        total,
        page,
        limit,
        hasMore: skip + cars.length < total,
      },
    });
  } catch (error) {
    console.error("Error fetching cars:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch cars" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse>> {
  const createUrl = new URL("/api/cars/create", req.url);
  return NextResponse.redirect(createUrl) as NextResponse<ApiResponse>;
}
