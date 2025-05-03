"use client";

import CardHouse from "@/components/house/card-house";
import type { IHouse } from "@/lib/models/house.model";
import React, { useEffect, useState } from "react";
import LoadingSkeleton from "@/app/(root)/house/loading";
import { useAuth } from "@clerk/nextjs";
import { ChevronDown, Filter, House, SlidersHorizontal } from "lucide-react";
import FilterSection from "../filter-section";
import ListingBanner from "../listing-banner";

const CardContainer: React.FC = () => {
  const { userId } = useAuth();
  const [houses, setHouses] = useState<IHouse[]>([]);
  const [userHouses, setUserHouses] = useState<IHouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(6);
  const [hasMore, setHasMore] = useState(true);
  const [sortOrder, setSortOrder] = useState<string>("Default");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [fullHouses, setFullHouses] = useState<IHouse[]>([]);

  // Filter options for properties
  const filterOptions = [
    { value: "Default", label: "Sort: Default" },
    { value: "Price Low to High", label: "Price: Low to High" },
    { value: "Price High to Low", label: "Price: High to Low" },
    { value: "Size Small to Large", label: "Size: Small to Large" },
    { value: "Size Large to Small", label: "Size: Large to Small" },
    { value: "Bedrooms (Ascending)", label: "Bedrooms: Fewest First" },
    { value: "Bedrooms (Descending)", label: "Bedrooms: Most First" },
  ];

  // Additional filter chips
  const filterChips = [
    { value: "1-bedroom", label: "1 Bedroom" },
    { value: "2-bedroom", label: "2 Bedrooms" },
    { value: "3-bedroom", label: "3+ Bedrooms" },
    { value: "parking", label: "Parking" },
    { value: "furnished", label: "Furnished" },
  ];

  const allFilterOptions = [...filterOptions, ...filterChips];

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const response = await fetch("/api/house", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          // Filter out pending houses - only show active listings
          const activeHouses = data.filter(
            (house: IHouse) => house.status === "Active"
          );

          // Separate user houses from all houses
          if (userId) {
            const userOwnedHouses = activeHouses.filter(
              (house) => house.userId === userId
            );
            setUserHouses(userOwnedHouses);
          }

          setHouses(activeHouses);
          setFullHouses(activeHouses); // Store the full set of houses for filtering
          setHasMore(activeHouses.length > displayLimit);
        } else {
          throw new Error("Invalid data format: Expected an array");
        }
      } catch (error) {
        console.error("Error fetching houses:", error);
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchHouses();
  }, [userId, displayLimit]);

  const handleSortChange = (value: string) => {
    setSortOrder(value);
    let sortedHouses = [...houses];

    if (value === "Price Low to High") {
      sortedHouses.sort((a, b) => a.price - b.price);
    } else if (value === "Price High to Low") {
      sortedHouses.sort((a, b) => b.price - a.price);
    } else if (value === "Size Small to Large") {
      sortedHouses.sort((a, b) => a.size - b.size);
    } else if (value === "Size Large to Small") {
      sortedHouses.sort((a, b) => b.size - a.size);
    } else if (value === "Bedrooms (Ascending)") {
      sortedHouses.sort((a, b) => a.bedroom - b.bedroom);
    } else if (value === "Bedrooms (Descending)") {
      sortedHouses.sort((a, b) => b.bedroom - a.bedroom);
    } else {
      sortedHouses = [...houses];
    }
    setHouses(sortedHouses);
  };

  const handleFilterChange = (filters: string[]) => {
    setActiveFilters(filters);
    if (filters.length === 0) {
      setHouses(fullHouses);
    } else {
      // Apply multiple filter conditions
      const filteredHouses = fullHouses.filter((house) => {
        // Each filter can be from different categories
        return filters.some((filter) => {
          // Check advertisement type filters
          if (filter === "For Rent") {
            return house.advertisementType === "Rent";
          }
          if (filter === "For Sale") {
            return house.advertisementType === "Sale";
          }

          // Check bedroom filters
          if (filter === "1-bedroom") {
            return house.bedroom === 1;
          }
          if (filter === "2-bedroom") {
            return house.bedroom === 2;
          }
          if (filter === "3-bedroom") {
            return house.bedroom >= 3;
          }

          // Check essentials filters
          if (
            filter === "WiFi" ||
            filter === "Gym" ||
            filter === "Furnished" ||
            filter === "Play Ground" ||
            filter === "Outdoor" ||
            filter === "Dining Area" ||
            filter === "Jacuzzi" ||
            filter === "Steam"
          ) {
            return house.essentials && house.essentials.includes(filter);
          }

          // Check parking filter
          if (filter === "parking") {
            return house.parkingSpace > 0;
          }

          // Check house type filters
          if (
            filter === "House" ||
            filter === "Apartment" ||
            filter === "Guest House"
          ) {
            return house.houseType === filter;
          }

          return false;
        });
      });

      setHouses(filteredHouses);
    }
  };

  // Create comprehensive filter options
  const getFilterOptions = () => {
    // Advertisement type filters - add these at the top
    const adTypeFilters = [
      { value: "For Rent", label: "For Rent" },
      { value: "For Sale", label: "For Sale" },
    ];

    // Features filters
    const featureFilters = [
      { value: "parking", label: "Parking" },
      { value: "WiFi", label: "WiFi" },
      { value: "Furnished", label: "Furnished" },
      { value: "Gym", label: "Gym" },
      { value: "Outdoor", label: "Outdoor" },
      { value: "Dining Area", label: "Dining Area" },
    ];

    // House type filters
    const houseTypeFilters = [
      { value: "House", label: "House" },
      { value: "Apartment", label: "Apartment" },
      { value: "Guest House", label: "Guest House" },
    ];

    return [...adTypeFilters, ...featureFilters, ...houseTypeFilters];
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
    setDisplayLimit((prev) => prev + 6);
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

  const displayedHouses = houses.slice(0, displayLimit);

  return (
    <>
      <div className="container pb-10">
        <ListingBanner type="house" />

        {/* Filter Section */}
        <div className="pt-10 pb-5">
          <FilterSection
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            filterOptions={getFilterOptions()}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onSearchResultSelect={handleSearchResultSelect}
            showSearchResults={true}
            modelType="house"
          />
        </div>

        {/* User's Listings Section */}
        {userId && userHouses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
              Your Listings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userHouses.map((house) => (
                <CardHouse key={house._id} {...house} />
              ))}
            </div>
          </div>
        )}

        {/* All Listings Section */}
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
          All Available Properties
        </h2>
        {displayedHouses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedHouses.map((house) => (
                <CardHouse key={house._id} {...house} />
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center py-10 text-gray-500">
            No properties available.
          </p>
        )}
      </div>
    </>
  );
};

export default CardContainer;
