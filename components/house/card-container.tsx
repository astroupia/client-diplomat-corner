"use client";

import CardHouse from "@/components/house/card-house";
import type { IHouse } from "@/lib/models/house.model";
import React, { useEffect, useState, useRef } from "react";
import LoadingSkeleton from "@/app/(root)/house/loading";
import { useAuth, useUser } from "@clerk/nextjs";
import {
  ChevronDown,
  Filter,
  House,
  SlidersHorizontal,
  Check,
  Loader2,
} from "lucide-react";
import FilterSection from "../filter-section";
import ListingBanner from "../listing-banner";
import { motion, AnimatePresence } from "framer-motion";

interface CardContainerProps {
  advertisementType?: string;
}

interface HouseData {
  _id: string;
  price: number;
  bedroom: number;
  bathroom: number;
  size: number;
  rating: number;
  likes: number;
  status?: string;
  userId?: string;
  name?: string;
  description?: string;
  advertisementType?: string;
  houseType?: string;
  condition?: string;
  maintenance?: string;
  essentials?: string[];
  currency?: string;
  imageUrl?: string;
  imageUrls?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: string | number | boolean | Date | string[] | undefined;
}

const CardContainer: React.FC<CardContainerProps> = ({ advertisementType }) => {
  const { userId } = useAuth();
  const { user } = useUser();
  const [houses, setHouses] = useState<IHouse[]>([]);
  const [userHouses, setUserHouses] = useState<IHouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const itemsPerPage = 20;
  const [sortOrder, setSortOrder] = useState<string>("Default");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [fullHouses, setFullHouses] = useState<IHouse[]>([]);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const [totalItems, setTotalItems] = useState(0);

  // Sort options
  const sortOptions = [
    { value: "Default", label: "Default" },
    { value: "Price Low to High", label: "Price: Low to High" },
    { value: "Price High to Low", label: "Price: High to Low" },
    { value: "Size Small to Large", label: "Size: Small to Large" },
    { value: "Size Large to Small", label: "Size: Large to Small" },
  ];

  // Filter options for houses
  const filterOptions = [
    // Only show advertisement type filters if no specific type is provided
    ...(advertisementType
      ? []
      : [
          { value: "For Rent", label: "For Rent" },
          { value: "For Sale", label: "For Sale" },
        ]),
    // Property type filters
    { value: "Apartment", label: "Apartment" },
    { value: "House", label: "House" },
    { value: "Villa", label: "Villa" },
    { value: "Condo", label: "Condo" },
    { value: "Townhouse", label: "Townhouse" },
    // Bedroom filters
    { value: "1", label: "1 Bedroom" },
    { value: "2", label: "2 Bedrooms" },
    { value: "3", label: "3 Bedrooms" },
    { value: "4+", label: "4+ Bedrooms" },
    // Bathroom filters
    { value: "1", label: "1 Bathroom" },
    { value: "2", label: "2 Bathrooms" },
    { value: "3+", label: "3+ Bathrooms" },
  ];

  const allFilterOptions = [...filterOptions];

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user's houses if userId is available
        if (userId) {
          const userHousesResponse = await fetch(
            `/api/house?userId=${userId}&limit=1000`
          );
          const userHousesData = await userHousesResponse.json();

          if (userHousesData.success && Array.isArray(userHousesData.houses)) {
            const formattedUserHouses = userHousesData.houses.map(
              (house: HouseData) => ({
                ...house,
                price: Number(house.price),
                bedroom: Number(house.bedroom),
                bathroom: Number(house.bathroom),
                size: Number(house.size),
                rating: Number(house.rating) || 0,
                likes: Number(house.likes) || 0,
              })
            );
            setUserHouses(formattedUserHouses);
          }
        }

        // Fetch other users' houses with pagination
        const response = await fetch(
          `/api/house?page=${currentPage}&limit=${itemsPerPage}&excludeUserId=${
            userId || ""
          }`
        );
        const data = await response.json();

        if (data.success && Array.isArray(data.houses)) {
          const formattedHouses = data.houses.map((house: HouseData) => ({
            ...house,
            price: Number(house.price),
            bedroom: Number(house.bedroom),
            bathroom: Number(house.bathroom),
            size: Number(house.size),
            rating: Number(house.rating) || 0,
            likes: Number(house.likes) || 0,
          }));

          // Append new houses to existing ones instead of replacing
          setHouses((prevHouses) =>
            currentPage === 1
              ? formattedHouses
              : [...prevHouses, ...formattedHouses]
          );
          setHasMore(data.pagination.hasMore);
          setTotalItems(data.pagination.total);
        } else {
          setError("Failed to fetch houses");
        }
      } catch (err) {
        setError("Error fetching houses");
        console.error("Error fetching houses:", err);
      } finally {
        setLoading(false);
        setIsLoadingMore(false);
      }
    };

    fetchHouses();
  }, [currentPage, itemsPerPage, userId]);

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

  const handleSortChange = (value: string) => {
    setSortOrder(value);
    let sortedHouses = [...houses];

    switch (value) {
      case "Price Low to High":
        sortedHouses.sort((a, b) => a.price - b.price);
        break;
      case "Price High to Low":
        sortedHouses.sort((a, b) => b.price - a.price);
        break;
      case "Size Small to Large":
        sortedHouses.sort((a, b) => a.size - b.size);
        break;
      case "Size Large to Small":
        sortedHouses.sort((a, b) => b.size - a.size);
        break;
      default:
        // Default sorting (restore original order)
        sortedHouses = [...fullHouses];
    }

    setHouses(sortedHouses);
  };

  const handleFilterChange = (filters: string[]) => {
    setActiveFilters(filters);
    if (filters.length === 0) {
      setHouses(fullHouses);
      return;
    }

    // Apply multiple filter conditions
    const filteredHouses = fullHouses.filter((house) => {
      return filters.some((filter) => {
        // Check advertisement type filters
        if (filter === "For Rent") return house.advertisementType === "Rent";
        if (filter === "For Sale") return house.advertisementType === "Sale";

        // Check house type filters
        if (["House", "Apartment", "Guest House"].includes(filter)) {
          return house.houseType === filter;
        }

        // Check bedroom filters
        if (filter === "1-bedroom") return house.bedroom === 1;
        if (filter === "2-bedroom") return house.bedroom === 2;
        if (filter === "3-bedroom") return house.bedroom >= 3;

        // Check features
        if (
          [
            "parking",
            "WiFi",
            "Furnished",
            "Gym",
            "Outdoor",
            "Dining Area",
          ].includes(filter)
        ) {
          return house.essentials?.includes(filter);
        }

        return false;
      });
    });

    setHouses(filteredHouses);
    // After filtering, apply current sort if it's not default
    if (sortOrder !== "Default") {
      handleSortChange(sortOrder);
    }
  };

  // Handle search result selection
  const handleSearchResultSelect = (result: {
    id: string;
    name: string;
    type: string;
  }) => {
    // Redirect to the house detail page if needed
    if (result.type === "house") {
      window.location.href = `/house/${result.id}`;
    }
  };

  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      setIsLoadingMore(true);
      setCurrentPage((prev) => prev + 1);
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  const displayedHouses = houses.slice(0, currentPage * itemsPerPage);

  return (
    <div className="w-full">
      {/* Filter and Sort Section */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 relative z-30">
        <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-4 px-2 py-4">
          <ListingBanner
            type="house"
            title={
              advertisementType === "Sale"
                ? "Houses for Sale"
                : "Houses for Rent"
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
                {houses.length} {houses.length === 1 ? "house" : "houses"} found
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
                modelType="house"
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-4 px-2 py-6 relative z-0">
        {/* Your Listed Properties Section */}
        {userId && userHouses.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Your Listed Properties</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {userHouses.map((house) => (
                <CardHouse
                  key={house._id}
                  {...house}
                  listedBy={user?.firstName || "Unknown User"}
                />
              ))}
            </div>
          </div>
        )}

        {/* Other Listings Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Listings</h2>
          {loading && currentPage === 1 ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {houses.map((house) => (
                  <CardHouse
                    key={house._id}
                    {...house}
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
    </div>
  );
};

export default CardContainer;
