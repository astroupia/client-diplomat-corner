// app/api/advertisements/route.ts
import {  NextResponse } from "next/server";
import { getAllAD } from "@/lib/actions/advertisements.actions";
import { AdvertisementResponse } from "@/lib/models/advertisement.model";

export async function GET(): Promise<NextResponse<AdvertisementResponse[] | { error: string }>> {
  try {
    const ads = await getAllAD();
    return NextResponse.json(ads);
  } catch (error) {
    console.error("Error fetching advertisements:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: message === "No advertisements found in the database" ? 404 : 500 });
  }
}