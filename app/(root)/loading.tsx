import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="animate-pulse w-full">
      <section className="pt-2 sm:pt-3 md:pt-4">
        <MaxWidthWrapper className="px-2 sm:px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 sm:gap-6">
            {/* Left Column - Advertisement Space */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6">
              <Skeleton className="w-full h-[320px] sm:h-[420px] rounded-xl sm:rounded-2xl" />
              <div className="grid grid-cols-2 gap-3 sm:gap-6">
                <Skeleton className="w-full h-[150px] sm:h-[200px] rounded-xl sm:rounded-2xl" />
                <Skeleton className="w-full h-[150px] sm:h-[200px] rounded-xl sm:rounded-2xl" />
              </div>
            </div>

            {/* Right Column - Shop Now Feature */}
            <div className="lg:col-span-5 mt-4 lg:mt-0">
              <Skeleton className="w-full h-[420px] sm:h-[500px] lg:h-full rounded-xl sm:rounded-2xl" />
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 sm:py-16">
        <MaxWidthWrapper className="px-2 sm:px-4">
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-8 w-24" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="w-full h-48 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      {/* Services Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <MaxWidthWrapper className="px-2 sm:px-4">
          <div className="space-y-8">
            <div className="text-center">
              <Skeleton className="h-8 w-48 mx-auto" />
              <Skeleton className="h-4 w-64 mx-auto mt-2" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-4 p-6 bg-white rounded-xl">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 sm:py-16">
        <MaxWidthWrapper className="px-2 sm:px-4">
          <div className="space-y-8">
            <div className="text-center">
              <Skeleton className="h-8 w-48 mx-auto" />
              <Skeleton className="h-4 w-64 mx-auto mt-2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Skeleton className="w-full h-64 rounded-xl" />
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>
    </div>
  );
}
