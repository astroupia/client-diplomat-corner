"use client";

import { useUser } from "@clerk/nextjs";
import ManageHouse from "@/components/manage-house";
import HouseLoadingPage from "@/components/loading-effects/manage-house-loading";

export default function ManageHousePage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <HouseLoadingPage />;
  }

  return (
    <div className="container mx-auto px-4">
      <ManageHouse />
    </div>
  );
}
