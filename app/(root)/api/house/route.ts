// app/api/houses/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Document } from "mongoose";
import House, { IHouse } from "@/lib/models/house.model";
import { connectToDatabase } from "@/lib/db-connect";

interface ApiResponse {
  success: boolean;
  error?: string;
  houses?: IHouse[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export async function GET(
  req: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    await connectToDatabase();

    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");
    const visibility = searchParams.get("visibility");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const advertisementType = searchParams.get("advertisementType");
    const skip = (page - 1) * limit;

    const query: Record<string, string> = { status: "Active" };
    if (userId) query.userId = userId;
    if (status) query.status = status;
    if (visibility) query.visibility = visibility;
    if (advertisementType) query.advertisementType = advertisementType;

    console.log("House API Query:", query);

    // Get total count for pagination
    const totalCount = await House.countDocuments(query);

    // Get paginated results
    const houses = await House.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    console.log(`Found ${houses.length} houses in the database (page ${page})`);

    const hasMore = skip + houses.length < totalCount;

    // Convert Mongoose documents to plain objects and ensure they match IHouse interface
    const formattedHouses = houses.map((house) => ({
      _id: house._id.toString(),
      name: house.name,
      userId: house.userId,
      description: house.description,
      advertisementType: house.advertisementType,
      price: house.price,
      paymentMethod: house.paymentMethod,
      bedroom: house.bedroom,
      parkingSpace: house.parkingSpace,
      bathroom: house.bathroom,
      size: house.size,
      houseType: house.houseType,
      condition: house.condition || "",
      maintenance: house.maintenance || "",
      essentials: house.essentials || [],
      currency: house.currency || "",
      imageUrl: house.imageUrl,
      imageUrls: house.imageUrls || [],
      paymentId: house.paymentId,
      visiblity: house.visiblity,
      status: house.status,
      createdAt: house.createdAt,
      updatedAt: house.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      houses: formattedHouses,
      pagination: {
        page,
        limit,
        total: totalCount,
        hasMore,
      },
    });
  } catch (error) {
    console.error("Error fetching houses:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    console.log("POST /api/houses called with body:", body);
    const {
      name,
      userId,
      description,
      advertisementType,
      price,
      paymentMethod,
      bedroom,
      parkingSpace,
      bathroom,
      size,
      houseType,
      condition,
      maintenance,
      essentials,
      currency,
    } = body;

    if (
      !name ||
      !userId ||
      !description ||
      !advertisementType ||
      !price ||
      !paymentMethod ||
      !bedroom ||
      !parkingSpace ||
      !bathroom ||
      !size ||
      !houseType
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newHouse = new House({
      name,
      userId,
      description,
      advertisementType,
      price,
      paymentMethod,
      bedroom,
      parkingSpace,
      bathroom,
      size,
      houseType,
      condition,
      maintenance,
      essentials,
      currency,
    });

    await newHouse.save();
    return NextResponse.json(newHouse, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/houses:", error);
    return NextResponse.json(
      {
        error: `Failed to create house: ${
          (error as Error).message || "Unknown server error"
        }`,
      },
      { status: 500 }
    );
  }
}
