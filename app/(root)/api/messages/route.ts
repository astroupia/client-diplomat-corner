import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db-connect";
import Message from "@/lib/models/message.model";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "subject",
      "message",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create the message
    const message = await Message.create(body);

    return NextResponse.json(
      { success: true, message: "Message sent successfully", data: message },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send message",
        errors:
          error instanceof Error && "errors" in error && error.errors
            ? Object.values(
                error.errors as Record<
                  string,
                  { path: string; message: string }
                >
              ).map((err) => ({
                field: err.path,
                message: err.message,
              }))
            : undefined,
      },
      { status: 500 }
    );
  }
}
