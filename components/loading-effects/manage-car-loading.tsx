import { Car, Home } from "lucide-react";
import Link from "next/link";
import MaxWidthWrapper from "@/components/max-width-wrapper";

export default function CarLoadingPage() {
  return (
    <section className="flex flex-col min-h-screen bg-gray-50">
      <MaxWidthWrapper>
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-64 bg-gray-200 rounded-md animate-pulse mb-6"></div>

          {/* Main Content */}
          <main className="flex-1 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg w-full sm:w-auto">
                <Car className="w-5 h-5" />
                <span className="font-medium">Create Cars</span>
              </div>
              <Link href="/manage-product/house">
                <button className="flex items-center gap-2 px-4 py-2 bg-white text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors w-full sm:w-auto">
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Create House</span>
                </button>
              </Link>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-8 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="h-5 w-20 bg-gray-200 rounded-md animate-pulse mb-1"></div>
                    <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>
                  <div>
                    <div className="h-5 w-20 bg-gray-200 rounded-md animate-pulse mb-1"></div>
                    <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>
                </div>

                {/* Car Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="h-5 w-20 bg-gray-200 rounded-md animate-pulse mb-1"></div>
                    <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>
                  <div>
                    <div className="h-5 w-20 bg-gray-200 rounded-md animate-pulse mb-1"></div>
                    <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>
                </div>

                {/* Transmission */}
                <div>
                  <div className="h-5 w-32 bg-gray-200 rounded-md animate-pulse mb-2"></div>
                  <div className="flex flex-wrap gap-2">
                    <div className="h-10 w-32 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-10 w-32 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Fuel Type */}
                <div>
                  <div className="h-5 w-24 bg-gray-200 rounded-md animate-pulse mb-2"></div>
                  <div className="flex flex-wrap gap-2">
                    <div className="h-10 w-28 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-10 w-28 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-10 w-28 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-10 w-28 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Body Type */}
                <div>
                  <div className="h-5 w-24 bg-gray-200 rounded-md animate-pulse mb-2"></div>
                  <div className="flex flex-wrap gap-2">
                    <div className="h-10 w-28 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-10 w-28 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-10 w-28 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-10 w-28 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-10 w-28 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <div className="h-5 w-28 bg-gray-200 rounded-md animate-pulse mb-1"></div>
                  <div className="h-32 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-4 space-y-6">
                {/* File Uploads */}
                <div className="space-y-4">
                  {/* Car Image Upload */}
                  <div className="space-y-2">
                    <div className="h-5 w-24 bg-gray-200 rounded-md animate-pulse mb-1"></div>

                    {/* Image Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-40 bg-gray-200 rounded-lg animate-pulse"></div>
                      <div className="h-40 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>

                    <div className="h-10 w-40 bg-gray-200 rounded-lg animate-pulse mt-2"></div>
                    <div className="h-4 w-48 bg-gray-200 rounded-md animate-pulse mt-1"></div>
                  </div>

                  {/* Receipt Upload */}
                  <div className="space-y-2">
                    <div className="h-5 w-40 bg-gray-200 rounded-md animate-pulse mb-1"></div>
                    <div className="h-40 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="h-10 w-40 bg-gray-200 rounded-lg animate-pulse mt-2"></div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="h-5 w-24 bg-gray-200 rounded-md animate-pulse mb-1"></div>
                    <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>
                  <div>
                    <div className="h-5 w-24 bg-gray-200 rounded-md animate-pulse mb-1"></div>
                    <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>
                </div>

                {/* Price */}
                <div>
                  <div className="h-5 w-16 bg-gray-200 rounded-md animate-pulse mb-1"></div>
                  <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                </div>

                {/* Advertisement Type */}
                <div>
                  <div className="h-5 w-40 bg-gray-200 rounded-md animate-pulse mb-2"></div>
                  <div className="flex gap-4">
                    <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>
                </div>

                {/* Service Price */}
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-28 bg-gray-200 rounded-md animate-pulse"></div>
                    <div className="h-8 w-20 bg-gray-200 rounded-md animate-pulse"></div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="h-12 w-full bg-gray-300 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </main>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
