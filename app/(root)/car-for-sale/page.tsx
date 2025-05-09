import React from "react";
import CardContainer from "@/components/car/card-container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cars For Sale | Diplomat Corner",
  description: "Browse all cars available for sale on Diplomat Corner",
};

export default function CarForSalePage() {
  return (
    <div className="container mx-auto py-2">
      <CardContainer advertisementType="Sale" />
    </div>
  );
}
