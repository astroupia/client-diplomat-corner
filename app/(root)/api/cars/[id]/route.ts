import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db-connect";
import Car from "@/lib/models/car.model";
import Payment from "@/lib/models/payment.model";
import { auth } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";

const CPANEL_API_URL = process.env.NEXT_PUBLIC_CPANEL_API_URL;
const CPANEL_USERNAME = process.env.NEXT_PUBLIC_CPANEL_USERNAME;
const CPANEL_API_TOKEN = process.env.NEXT_PUBLIC_CPANEL_API_TOKEN;
const PUBLIC_DOMAIN = process.env.NEXT_PUBLIC_PUBLIC_DOMAIN;

// Define the params type to match Next.js route segments
interface RouteParams {
  params: {
    id: string;
  };
}

interface ApiResponse {
  success: boolean;
  error?: string;
  message?: string;
  carId?: string;
  paymentId?: string;
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
    console.log("🚀 Starting image upload to cPanel (cars [id] route)...");
    console.log(
      "📡 API URL:",
      `${CPANEL_API_URL}/execute/Fileman/upload_files`
    );
    console.log("👤 Username:", CPANEL_USERNAME);
    console.log("🔑 Token exists:", !!CPANEL_API_TOKEN);
    console.log("📁 Upload folder:", uploadFolder);
    console.log("📄 File name:", randomFileName);
    console.log("📏 File size:", file.size, "bytes");

    const response = await fetch(
      `${CPANEL_API_URL}/execute/Fileman/upload_files`,
      {
        method: "POST",
        headers: { Authorization: authHeader },
        body: apiFormData,
      }
    );

    console.log("📊 Response status:", response.status);
    console.log("📊 Response status text:", response.statusText);
    console.log(
      "📊 Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ cPanel API error response:", errorText);
      console.error("❌ Error response length:", errorText.length);
      console.error("❌ Error response preview:", errorText.substring(0, 500));
      return {
        success: false,
        error: `Upload failed: ${response.status} ${response.statusText}`,
      };
    }

    // Try to parse JSON response
    let data;
    try {
      const responseText = await response.text();
      console.log("📄 Raw response text length:", responseText.length);
      console.log("📄 Raw response preview:", responseText.substring(0, 500));

      data = JSON.parse(responseText);
      console.log("✅ Successfully parsed JSON response:", data);
    } catch (jsonError) {
      console.error("❌ Failed to parse JSON response:", jsonError);
      const responseText = await response.text();
      console.error("❌ Full response text:", responseText);
      console.error("❌ Response text length:", responseText.length);
      console.error("❌ Response starts with:", responseText.substring(0, 100));
      return {
        success: false,
        error:
          "Invalid response from upload service - received HTML instead of JSON",
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

// PUT handler
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const userId = (await auth()).userId;
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", paymentId: "" },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    // Handle multiple files
    const files: File[] = [];
    formData.getAll("files").forEach((file) => {
      if (file instanceof File) {
        files.push(file);
      }
    });

    // For backward compatibility
    const singleFile = formData.get("file") as File | null;
    if (singleFile) {
      files.push(singleFile);
    }

    const receiptFile = formData.get("receipt") as File;

    // Parse existing/removed image URLs
    let existingImageUrls: string[] = [];
    try {
      const existingImageUrlsStr = formData.get("existingImageUrls") as string;
      if (existingImageUrlsStr) {
        existingImageUrls = JSON.parse(existingImageUrlsStr);
      }
    } catch (e) {
      console.error("Error parsing existingImageUrls:", e);
    }

    let removedImageUrls: string[] = [];
    try {
      const removedImageUrlsStr = formData.get("removedImageUrls") as string;
      if (removedImageUrlsStr) {
        removedImageUrls = JSON.parse(removedImageUrlsStr);
      }
    } catch (e) {
      console.error("Error parsing removedImageUrls:", e);
    }

    const carData = {
      name: formData.get("name") as string,
      year: Number(formData.get("year")),
      mileage: Number(formData.get("mileage")),
      speed: Number(formData.get("speed")),
      milesPerGallon: Number(formData.get("milesPerGallon")),
      transmission: formData.get("transmission") as string,
      fuel: formData.get("fuel") as string,
      bodyType: formData.get("bodyType") as string,
      condition: formData.get("condition") as string,
      engine: formData.get("engine") as string,
      maintenance: formData.get("maintenance") as string,
      price: Number(formData.get("price")),
      description: formData.get("description") as string,
      advertisementType: formData.get("advertisementType") as "Rent" | "Sale",
      paymentMethod: (() => {
        const paymentValue = formData.get("paymentMethod") as string;
        // Map numeric values to string values expected by the schema
        switch (paymentValue) {
          case "1":
            return "Daily";
          case "2":
            return "Weekly";
          case "3":
            return "Monthly";
          case "4":
            return "Annually";
          default:
            return paymentValue as "Daily" | "Weekly" | "Monthly" | "Annually";
        }
      })(),
      currency: formData.get("currency") as string,
      tags: formData.get("tags") as string,
      updatedAt: new Date(),
    };

    // Validate required fields
    if (!carData.name || !carData.price || !carData.mileage) {
      return NextResponse.json(
        { success: false, error: "Missing required fields", paymentId: "" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find existing car
    const existingCar = await Car.findById(id);
    if (!existingCar) {
      return NextResponse.json(
        { success: false, error: "Car not found", paymentId: "" },
        { status: 404 }
      );
    }

    // Check ownership
    if (existingCar.userId !== userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", paymentId: "" },
        { status: 401 }
      );
    }

    // Start with existing image URLs if available, or create an empty array
    let imageUrls: string[] = existingCar.imageUrls || [];

    // Remove the specified images
    if (removedImageUrls.length > 0) {
      imageUrls = imageUrls.filter((url) => !removedImageUrls.includes(url));
    }

    // Add the existing images from the form
    if (existingImageUrls.length > 0) {
      // Ensure we don't have duplicates
      existingImageUrls.forEach((url) => {
        if (!imageUrls.includes(url)) {
          imageUrls.push(url);
        }
      });
    }

    // Upload any new car images
    for (const file of files) {
      const uploadResult = await uploadImage(file, "public_images");
      if (!uploadResult.success) {
        return NextResponse.json(
          { success: false, error: uploadResult.error, paymentId: "" },
          { status: 500 }
        );
      }
      imageUrls.push(uploadResult.publicUrl!);
    }

    // Upload receipt if provided
    let receiptUrl = "";
    if (receiptFile) {
      const uploadResult = await uploadImage(receiptFile, "receipts");
      if (!uploadResult.success) {
        return NextResponse.json(
          { success: false, error: uploadResult.error, paymentId: "" },
          { status: 500 }
        );
      }
      receiptUrl = uploadResult.publicUrl || "";
    }

    // Update car with both single imageUrl and imageUrls
    const updatedCar = await Car.findByIdAndUpdate(
      id,
      {
        ...carData,
        imageUrl: imageUrls.length > 0 ? imageUrls[0] : existingCar.imageUrl, // Use first image as primary
        imageUrls: imageUrls,
      },
      { new: true }
    );

    // Update payment record if receipt was uploaded
    if (receiptUrl) {
      await Payment.findOneAndUpdate(
        { carId: id },
        {
          receiptUrl,
          servicePrice: Number(formData.get("servicePrice")),
          updatedAt: new Date(),
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Car updated successfully",
      carId: updatedCar._id.toString(),
      paymentId: existingCar.paymentId,
    });
  } catch (error) {
    console.error("Car update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update car", paymentId: "" },
      { status: 500 }
    );
  }
}

// DELETE handler
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const userId = (await auth()).userId;
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", paymentId: "" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const car = await Car.findById(id);
    if (!car) {
      return NextResponse.json(
        { success: false, error: "Car not found", paymentId: "" },
        { status: 404 }
      );
    }

    if (car.userId !== userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", paymentId: "" },
        { status: 401 }
      );
    }

    await Car.findByIdAndDelete(id);
    await Payment.findOneAndDelete({ carId: id });

    return NextResponse.json({
      success: true,
      message: "Car deleted successfully",
      carId: id,
      paymentId: car.paymentId,
    });
  } catch (error) {
    console.error("Car deletion error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete car", paymentId: "" },
      { status: 500 }
    );
  }
}

// GET handler
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    await connectToDatabase();

    const car = await Car.findById(id);
    if (!car) {
      return NextResponse.json(
        { success: false, error: "Car not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, ...car.toObject() });
  } catch (error) {
    console.error("Error fetching car:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch car" },
      { status: 500 }
    );
  }
}
