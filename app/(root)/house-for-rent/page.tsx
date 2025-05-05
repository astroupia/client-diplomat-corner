import React from "react";
import CardContainer from "@/components/house/card-container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Houses For Rent | Diplomat Corner",
  description: "Browse all properties available for rent on Diplomat Corner",
};

export default function HouseForRentPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Properties For Rent
      </h1>
      <CardContainer advertisementType="Rent" />
    </div>
  );
}
