import React from "react";
import CardContainer from "@/components/car/card-container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cars For Sale | Diplomat Corner",
  description: "Browse all cars available for sale on Diplomat Corner",
};

export default function CarForSale() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CardContainer advertisementType="Sale" />
    </div>
  );
}
