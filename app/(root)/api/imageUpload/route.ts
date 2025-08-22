import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

interface UploadResponse {
  success: boolean;
  publicUrl?: string;
  error?: string;
}

const CPANEL_API_URL = process.env.NEXT_PUBLIC_CPANEL_API_URL;
const CPANEL_USERNAME = process.env.NEXT_PUBLIC_CPANEL_USERNAME;
const CPANEL_API_TOKEN = process.env.NEXT_PUBLIC_CPANEL_API_TOKEN;
const PUBLIC_DOMAIN = process.env.NEXT_PUBLIC_PUBLIC_DOMAIN;

if (
  !CPANEL_API_URL ||
  !CPANEL_USERNAME ||
  !CPANEL_API_TOKEN ||
  !PUBLIC_DOMAIN
) {
  throw new Error("Missing required cPanel environment variables");
}

// Define the cPanel API response structure
interface CpanelResponse {
  status: number;
  errors?: string[] | null;
  data?: {
    succeeded: number;
    failed: number;
    warned: number;
    uploads: {
      size: number;
      warnings: string[];
      file: string;
      reason: string;
      status: number;
    }[];
  };
  warnings?: string[] | null;
  messages?: string[] | null;
  metadata?: Record<string, unknown>;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<UploadResponse>> {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString("base64");

    const response = await fetch(
      `${CPANEL_API_URL}/execute/Fileman/upload_files`,
      {
        method: "POST",
        headers: {
          Authorization: `cpanel ${CPANEL_USERNAME}:${CPANEL_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dir: "/public_html/uploads",
          file: {
            name: file.name,
            data: base64Data,
          },
        }),
      }
    );

    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      const errorText = await response.text();
      console.error("cPanel API error response:", errorText);
      return NextResponse.json(
        {
          success: false,
          error: `Upload failed: ${response.status} ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    // Try to parse JSON response
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error("Failed to parse JSON response:", jsonError);
      const responseText = await response.text();
      console.error("Response text:", responseText);
      return NextResponse.json(
        { success: false, error: "Invalid response from upload service" },
        { status: 500 }
      );
    }

    // Check if the upload was successful
    if (data.status === 0 || data.errors) {
      return NextResponse.json(
        { success: false, error: data.errors?.join(", ") || "Upload failed" },
        { status: 500 }
      );
    }

    const fileUrl = `${PUBLIC_DOMAIN}/uploads/${file.name}`;
    return NextResponse.json({ success: true, publicUrl: fileUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
