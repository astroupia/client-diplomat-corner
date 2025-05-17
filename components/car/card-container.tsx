"use client";

import Card from "@/components/car/car-card";
import type { ICar } from "@/lib/models/car.model";
import React, { useEffect, useState, useRef } from "react";
import LoadingSkeleton from "@/app/(root)/car/loading";
import { useAuth, useUser } from "@clerk/nextjs";
import {
  Car,
  ChevronDown,
  Filter,
  SlidersHorizontal,
  Check,
  Loader2,
} from "lucide-react";
import FilterSection, { FilterOption } from "../filter-section";
import ListingBanner from "@/components/listing-banner";
import { motion, AnimatePresence } from "framer-motion";

interface CardContainerProps {
  advertisementType?: string;
}

const CardContainer: React.FC<CardContainerProps> = ({ advertisementType }) => {
  const { userId } = useAuth();
  const { user } = useUser();
  const [cars, setCars] = useState<ICar[]>([]);
  const [userCars, setUserCars] = useState<ICar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string>("Default");
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const itemsPerPage = 20;
  const [fullCars, setFullCars] = useState<ICar[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const sortOptions = [
    { value: "Default", label: "Default" },
    { value: "Price Low to High", label: "Price: Low to High" },
    { value: "Price High to Low", label: "Price: High to Low" },
    { value: "Size Small to Large", label: "Size: Small to Large" },
    { value: "Size Large to Small", label: "Size: Large to Small" },
  ];

  // Filter options for cars
  const filterOptions = [
    // Only show advertisement type filters if no specific type is provided
    ...(advertisementType
      ? []
      : [
          { value: "For Rent", label: "For Rent" },
          { value: "For Sale", label: "For Sale" },
        ]),
    // Body type filters
    { value: "Sedan", label: "Sedan" },
    { value: "SUV", label: "SUV" },
    { value: "Truck", label: "Truck" },
    { value: "Hatchback", label: "Hatchback" },
    { value: "Minivan", label: "Minivan" },
    // Fuel type filters
    { value: "Gasoline", label: "Gasoline" },
    { value: "Diesel", label: "Diesel" },
    { value: "Electric", label: "Electric" },
    { value: "Hybrid", label: "Hybrid" },
    // Transmission filters
    { value: "Automatic", label: "Automatic" },
    { value: "Manual", label: "Manual" },
  ];

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch(
          `/api/cars?page=${currentPage}&limit=${itemsPerPage}${
            advertisementType ? `&advertisementType=${advertisementType}` : ""
          }`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success && Array.isArray(data.cars)) {
          const validatedCars = data.cars.map((car: ICar) => ({
            ...car,
            price: Number(car.price) || 0,
            mileage: Number(car.mileage) || 0,
            milesPerGallon: Number(car.milesPerGallon) || 0,
            speed: Number(car.speed) || 0,
            transmission: car.transmission || "N/A",
            fuel: car.fuel || "N/A",
            bodyType: car.bodyType || "N/A",
            currency: car.currency || "ETB",
            advertisementType: car.advertisementType || "Sale",
          }));

          // Filter out pending cars - only show active listings
          const activeCars = validatedCars.filter(
            (car: ICar) => car.status === "Active"
          );

          // Separate user cars from all cars
          if (userId) {
            const userOwnedCars = activeCars.filter(
              (car: ICar) => car.userId === userId
            );
            setUserCars(userOwnedCars);
          }

          if (currentPage === 1) {
            setCars(activeCars);
            setFullCars(activeCars);
          } else {
            setCars((prevCars) => [...prevCars, ...activeCars]);
            setFullCars((prevCars) => [...prevCars, ...activeCars]);
          }

          setHasMore(data.pagination?.hasMore || false);
        } else {
          throw new Error(
            data.error || "Invalid data format: Expected an array of cars"
          );
        }
      } catch (error) {
        console.error("Error fetching cars:", error);
        setError((error as Error).message);
      } finally {
        setLoading(false);
        setIsLoadingMore(false);
      }
    };

    fetchCars();
  }, [userId, currentPage, advertisementType]);

  const handleSortChange = (value: string) => {
    setSortOrder(value);
    let sortedCars = [...cars];

    switch (value) {
      case "Price Low to High":
        sortedCars.sort((a, b) => a.price - b.price);
        break;
      case "Price High to Low":
        sortedCars.sort((a, b) => b.price - a.price);
        break;
      case "Size Small to Large":
        sortedCars.sort((a, b) => a.mileage - b.mileage);
        break;
      case "Size Large to Small":
        sortedCars.sort((a, b) => b.mileage - a.mileage);
        break;
      default:
        // Default sorting (restore original order)
        sortedCars = [...fullCars];
    }

    setCars(sortedCars);
  };

  // Handle filtering
  const handleFilterChange = (filters: string[]) => {
    setActiveFilters(filters);
    if (filters.length === 0) {
      setCars(fullCars);
      return;
    }

    // Apply multiple filter conditions
    const filteredCars = fullCars.filter((car) => {
      return filters.some((filter) => {
        // Check advertisement type filters
        if (filter === "For Rent") return car.advertisementType === "Rent";
        if (filter === "For Sale") return car.advertisementType === "Sale";

        // Check body type filters
        if (
          ["Sedan", "SUV", "Truck", "Hatchback", "Minivan"].includes(filter)
        ) {
          return car.bodyType === filter;
        }

        // Check fuel type filters
        if (["Gasoline", "Diesel", "Electric", "Hybrid"].includes(filter)) {
          return car.fuel === filter;
        }

        // Check transmission filters
        if (["Automatic", "Manual"].includes(filter)) {
          return car.transmission === filter;
        }

        return false;
      });
    });

    setCars(filteredCars);
    // After filtering, apply current sort if it's not default
    if (sortOrder !== "Default") {
      handleSortChange(sortOrder);
    }
  };

  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      setIsLoadingMore(true);
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Handle search result selection
  const handleSearchResultSelect = (result: {
    id: string;
    name: string;
    type: string;
  }) => {
    // Redirect to the car detail page if needed
    if (result.type === "car") {
      window.location.href = `/car/${result.id}`;
    }
  };

  // Add click outside handler for sort dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsSelectOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get current sort option label
  const getCurrentSortLabel = () => {
    const option = sortOptions.find((option) => option.value === sortOrder);
    return option ? option.label : "Sort By";
  };

  if (loading && currentPage === 1) {
    return <LoadingSkeleton />;
  }
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Filter and Sort Section */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 relative z-30">
        <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-4 px-2 py-4">
          <ListingBanner
            type="car"
            title={
              advertisementType === "Rent" ? "Cars for Rent" : "Cars for Sale"
            }
          />
          <div className="py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5B8F2D]"
              >
                <Filter className="w-4 h-4" />
                Filters
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    filterOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div className="text-sm text-gray-500">
                {cars.length} {cars.length === 1 ? "car" : "cars"} found
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="relative z-40" ref={selectRef}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsSelectOpen(!isSelectOpen)}
                className="flex items-center justify-between gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 hover:border-green-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 group min-w-[180px]"
              >
                <div className="flex items-center gap-2">
                  <SlidersHorizontal
                    size={16}
                    className="text-gray-500 group-hover:text-green-500 transition-colors"
                  />
                  <span className="font-medium">{getCurrentSortLabel()}</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-gray-500 transition-transform duration-300 ${
                    isSelectOpen ? "rotate-180" : ""
                  }`}
                />
              </motion.button>

              <AnimatePresence>
                {isSelectOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
                    style={{
                      minWidth: "220px",
                      maxHeight: "300px",
                      overflowY: "auto",
                    }}
                  >
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <motion.button
                          key={option.value}
                          whileHover={{
                            x: 4,
                            backgroundColor: "rgba(34, 197, 94, 0.05)",
                          }}
                          onClick={() => {
                            handleSortChange(option.value);
                            setIsSelectOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 flex items-center justify-between ${
                            sortOrder === option.value
                              ? "bg-green-50 text-green-600"
                              : "text-gray-700"
                          }`}
                        >
                          <span>{option.label}</span>
                          {sortOrder === option.value && (
                            <motion.div
                              initial={{ scale: 0, rotate: -45 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                              }}
                              className="bg-green-100 rounded-full p-0.5"
                            >
                              <Check size={14} className="text-green-600" />
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          {filterOpen && (
            <div className="mt-4">
              <FilterSection
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
                filterOptions={filterOptions}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
                onSearchResultSelect={handleSearchResultSelect}
                showSearchResults={true}
                modelType="car"
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-4 px-2 py-6 relative z-0">
        {/* Listing Banner */}
        {userId && userCars.length > 0 && (
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Your Listed Properties</h1>
          </div>
        )}

        {/* Cards Grid */}
        {loading && currentPage === 1 ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {cars.map((car) => (
                <Card
                  key={car._id}
                  {...car}
                  listedBy={user?.firstName || "Unknown User"}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  className={`px-6 py-3 text-sm font-medium text-white bg-[#5B8F2D] rounded-lg hover:bg-[#4A7324] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5B8F2D] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CardContainer;
