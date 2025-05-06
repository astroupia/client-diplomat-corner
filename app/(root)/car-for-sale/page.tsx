import React from "react";
import CardContainer from "@/components/car/card-container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cars For Sale | Diplomat Corner",
  description: "Browse all cars available for sale on Diplomat Corner",
};

export default function CarForSalePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Cars For Sale</h1>
      <CardContainer advertisementType="Sale" />
    </div>
  );
}
