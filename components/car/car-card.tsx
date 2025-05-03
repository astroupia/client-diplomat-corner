import React, { useEffect, useState } from "react";
import { Car, MapPin, Fuel, Pencil, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { ICar } from "@/lib/models/car.model";

interface CarCardProps extends ICar {
  listedBy: string;
}

const CarCard: React.FC<CarCardProps> = ({
  _id,
  name,
  price = 0,
  mileage = 0,
  year,
  speed = 0,
  transmission = "N/A",
  fuel = "N/A",
  bodyType = "N/A",
  currency = "ETB",
  imageUrl,
  advertisementType = "Sale",
  listedBy = "Admin",
  userId,
}) => {
  const { user } = useUser();
  const isOwner = user?.id === userId;
  const [displayName, setDisplayName] = useState(listedBy || "Admin");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            setDisplayName(
              data.user.name || data.user.email || listedBy || "Admin"
            );
          }
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    if (userId && userId !== "admin") {
      fetchUserInfo();
    }
  }, [userId, listedBy]);

  return (
    <div className="relative">
      <Link href={`/car/${_id}`} className="block">
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="relative">
            <Image
              width={300}
              height={200}
              src={imageUrl || "/assets/images/car.jpg"}
              alt="Car Image"
              className="w-full h-48 object-cover"
            />
            <span className="absolute top-2 right-2 bg-primary text-white text-xs font-semibold px-2 py-1 rounded-full">
              {advertisementType}
            </span>
          </div>
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-800 truncate">
              {name}
            </h2>
            <p className="text-green-600 text-xl font-bold mt-1">
              {currency} {price?.toLocaleString() || "0"}
            </p>
            <div className="flex flex-wrap justify-between text-gray-600 mt-2 gap-2">
              <div className="flex items-center gap-1">
                <Car size={16} />
                <span>{speed || 0} hp</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                <span>{mileage?.toLocaleString() || "0"} Km</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>{year || 0}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {transmission}
              </span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {fuel}
              </span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {bodyType}
              </span>
            </div>
            {/* <p className="text-gray-500 text-sm mt-2 truncate">
              Listed by {displayName}s
            </p> */}
          </div>
        </div>
      </Link>
      {isOwner && (
        <Link
          href={`/car/${_id}/edit`}
          className="absolute top-2 left-2 bg-white text-primary p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
          title="Edit car"
        >
          <Pencil size={16} />
        </Link>
      )}
    </div>
  );
};

export default CarCard;
