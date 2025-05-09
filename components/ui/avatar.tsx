"use client";

import React, { useState } from "react";
import Image from "next/image";

interface AvatarProps {
  imageUrl?: string;
  name: string;
  role?: "admin" | "customer";
  size?: "sm" | "md" | "lg";
}

const Avatar: React.FC<AvatarProps> = ({
  imageUrl,
  name,
  role = "customer",
  size = "sm",
}) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  const getFallbackImage = () => {
    if (role === "admin") {
      return "/assets/images/admin-avatar.png";
    }
    return "/assets/images/anonymous-avatar.png";
  };

  const renderContent = () => {
    // If there's a valid image URL and no loading error, try to show the image
    if (imageUrl && !imageError) {
      return (
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 48px) 100vw"
          onError={() => setImageError(true)}
        />
      );
    }

    // If it's an admin, show admin fallback
    if (role === "admin") {
      return (
        <div
          className={`${sizeClasses[size]} flex items-center justify-center bg-primary text-white font-medium`}
        >
          <span>AD</span>
        </div>
      );
    }

    // Default case: show initials
    return (
      <div
        className={`${sizeClasses[size]} flex items-center justify-center bg-[#5B8F2D] text-white font-medium`}
      >
        {getInitials(name)}
      </div>
    );
  };

  return (
    <div
      className={`relative rounded-full overflow-hidden ${sizeClasses[size]} bg-gray-100 ring-2 ring-white`}
    >
      {renderContent()}
    </div>
  );
};

export default Avatar;
