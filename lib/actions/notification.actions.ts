"use server";

import { connectToDatabase } from "@/lib/db-connect";
import House from "@/lib/models/house.model";

export async function sendNotification({
  userId,
  message,
  type,
  origin,
}: {
  userId: string;
  message: string;
  type: string;
  origin: string;
}) {
  try {
    const response = await fetch(`${origin}/api/notifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, message, type }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to send notification: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(`Failed to send notification: ${data.error}`);
    }
    return data.id; // Return the notification ID
  } catch (error: unknown) {
    console.error("Error sending notification:", error);
    return null;
  }
}
export async function getHouseById(id: string) {
  try {
    await connectToDatabase();
    const house = await House.findById(id);
    return house;
  } catch (error) {
    console.error("Error fetching house:", error);
    throw error;
  }
}
