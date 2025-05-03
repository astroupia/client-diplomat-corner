import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db-connect";
import House from "@/lib/models/house.model";
import Payment from "@/lib/models/payment.model";
import { auth } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";

const CPANEL_API_URL =
  process.env.CPANEL_API_URL || "https://diplomatcorner.net:2083";
const CPANEL_USERNAME = process.env.CPANEL_USERNAME || "diplomvv";
const CPANEL_API_TOKEN =
  process.env.CPANEL_API_TOKEN || "2JL5W3RUMNY0KOX451GL2PPY4L8RX9RS";
const PUBLIC_DOMAIN = process.env.PUBLIC_DOMAIN || "https://diplomatcorner.net";

interface HouseFormData {
  name: string;
  bedroom: number;
  size: number;
  bathroom: number;
  parkingSpace: number;
  condition: string;
  maintenance: string;
  price: number;
  description: string;
  advertisementType: "Rent" | "Sale";
  paymentMethod: "Monthly" | "Quarterly" | "Annual";
  houseType: "House" | "Apartment" | "Guest House";
  essentials: string[];
  currency: string;
  imageUrl?: string;
  userId?: string;
  createdAt?: Date;
  paymentId: string;
  visiblity: "Private" | "Public";
  status: "Pending" | "Active";
  paymentReceipt?: {
    url: string;
    paymentId: string;
    uploadedAt: Date;
  };
  imageUrls: string[];
}

interface ApiResponse {
  success: boolean;
  error?: string;
  message?: string;
  houseId?: string;
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
    const response = await fetch(
      `${CPANEL_API_URL}/execute/Fileman/upload_files`,
      {
        method: "POST",
        headers: { Authorization: authHeader },
        body: apiFormData,
      }
    );

    const data = await response.json();

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

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    const userId = (await auth()).userId;
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", paymentId: "" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const formData = await req.formData();

    const files: File[] = [];
    formData.getAll("files").forEach((file) => {
      if (file instanceof File) {
        files.push(file);
      }
    });

    const singleFile = formData.get("file") as File | null;
    if (singleFile) {
      files.push(singleFile);
    }

    const receiptFile = formData.get("receipt") as File;

    const paymentId = `${Date.now()}-${uuidv4()}`;

    const houseData: HouseFormData = {
      name: formData.get("name") as string,
      bedroom: Number(formData.get("bedroom")),
      size: Number(formData.get("size")),
      bathroom: Number(formData.get("bathroom")),
      parkingSpace: Number(formData.get("parkingSpace")),
      condition: formData.get("condition") as string,
      maintenance: formData.get("maintenance") as string,
      price: Number(formData.get("price")),
      description: formData.get("description") as string,
      advertisementType: formData.get("advertisementType") as "Rent" | "Sale",
      paymentMethod: formData.get("paymentMethod") as
        | "Monthly"
        | "Quarterly"
        | "Annual",
      houseType: formData.get("houseType") as
        | "House"
        | "Apartment"
        | "Guest House",
      essentials: JSON.parse(formData.get("essentials") as string),
      currency: formData.get("currency") as string,
      userId,
      createdAt: new Date(),
      paymentId,
      visiblity: "Private",
      status: "Pending",
      imageUrls: [],
    };

    if (
      !houseData.name ||
      !houseData.bedroom ||
      !houseData.size ||
      !houseData.bathroom ||
      !houseData.parkingSpace ||
      !houseData.price ||
      !houseData.description
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields", paymentId: "" },
        { status: 400 }
      );
    }

    const imageUrls: string[] = [];

    for (const file of files) {
      console.log("Uploading image to cPanel...");
      const uploadResult = await uploadImage(file, "public_images");
      if (!uploadResult.success) {
        console.error("Image upload failed:", uploadResult.error);
        return NextResponse.json(
          { success: false, error: uploadResult.error, paymentId: "" },
          { status: 500 }
        );
      }
      imageUrls.push(uploadResult.publicUrl!);
      console.log(
        "Image uploaded successfully. Public URL:",
        uploadResult.publicUrl
      );
    }

    let receiptUrl: string | undefined;
    if (receiptFile) {
      console.log("Uploading receipt to cPanel...");
      const uploadResult = await uploadImage(receiptFile, "receipts");
      if (!uploadResult.success) {
        console.error("Receipt upload failed:", uploadResult.error);
        return NextResponse.json(
          { success: false, error: uploadResult.error, paymentId: "" },
          { status: 500 }
        );
      }
      receiptUrl = uploadResult.publicUrl;
      console.log("Receipt uploaded successfully. Public URL:", receiptUrl);
    }

    console.log("Saving house to MongoDB with image URLs:", imageUrls);
    const houseToSave = new House({
      ...houseData,
      imageUrl: imageUrls.length > 0 ? imageUrls[0] : undefined,
      imageUrls: imageUrls,
      paymentReceipt: receiptUrl
        ? {
            url: receiptUrl,
            paymentId,
            uploadedAt: new Date(),
          }
        : undefined,
    });
    const result = await houseToSave.save();
    console.log("House saved successfully. ID:", result._id);

    await Payment.create({
      paymentId,
      servicePrice: Number(formData.get("servicePrice")),
      receiptUrl: receiptUrl || "",
      productId: result._id.toString(),
      productType: "house",
      userId,
      uploadedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "House created successfully",
      houseId: result._id.toString(),
      paymentId,
    });
  } catch (error) {
    console.error("House creation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create house", paymentId: "" },
      { status: 500 }
    );
  }
}
