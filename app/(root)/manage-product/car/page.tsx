"use client";

import ManageCar from "@/components/manage-car";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CarLoadingPage from "@/components/loading-effects/manage-car-loading";

export default function ManageCarPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    }
  }, [isLoaded, user, router]);

  if (!isLoaded) {
    return <CarLoadingPage />;
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4">
      <ManageCar />
    </div>
  );
}
