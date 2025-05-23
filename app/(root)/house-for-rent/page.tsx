import React from "react";
import CardContainer from "@/components/house/card-container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Houses For Rent | Diplomat Corner",
  description: "Browse all properties available for rent on Diplomat Corner",
};

export default function HouseForRentPage() {
  return (
    <div className="container mx-auto py-2">
      <CardContainer advertisementType="Rent" />
    </div>
  );
}
