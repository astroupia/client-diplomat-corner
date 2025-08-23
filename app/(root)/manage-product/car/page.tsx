"use client";

import ManageCar from "@/components/manage-car";
import { useUser } from "@clerk/nextjs";
import CarLoadingPage from "@/components/loading-effects/manage-car-loading";

export default function ManageCarPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <CarLoadingPage />;
  }

  return (
    <div className="container mx-auto px-4">
      <ManageCar />
    </div>
  );
}
