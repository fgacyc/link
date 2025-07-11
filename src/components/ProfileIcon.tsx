import React, { useState } from "react";
import { GoCheckCircleFill } from "react-icons/go";

interface ProfileIconProps {
  imageUrl: string;
  isVerified?: boolean;
  size?: "mini" | "small" | "medium" | "large";
  alt?: string;
  hideBorder?: boolean;
}

const SIZES = {
  mini: {
    container: 40,
    badge: 16,
  },
  small: {
    container: 52,
    badge: 20,
  },
  medium: {
    container: 68,
    badge: 24,
  },
  large: {
    container: 80,
    badge: 28,
  },
};

export const ProfileIcon: React.FC<ProfileIconProps> = ({
  imageUrl,
  isVerified = false,
  size = "medium",
  alt = "Profile picture",
  hideBorder,
}) => {
  const [hasImageError, setHasImageError] = useState(false);

  const handleImageError = () => {
    setHasImageError(true);
  };

  return (
    <div
      className="relative"
      style={{
        width: `${SIZES[size].container}px`,
        height: `${SIZES[size].container}px`,
      }}
    >
      {imageUrl && !hasImageError ? (
        <img
          src={imageUrl}
          alt={alt}
          className={`h-full w-full rounded-full ${hideBorder ? "" : `border border-white ${size === "mini" ? "p-px" : size === "small" ? "p-0.5" : "p-1"}`} bg-white object-cover`}
          onError={handleImageError}
        />
      ) : (
        <div
          className={`h-full w-full rounded-full ${hideBorder ? "" : `border border-white ${size === "mini" ? "p-px" : size === "small" ? "p-0.5" : "p-1"}`} flex items-center justify-center bg-gray-200`}
        >
          <div className="text-center text-gray-500">
            <span className="text-lg">👤</span>
          </div>
        </div>
      )}
      {isVerified && (
        <GoCheckCircleFill
          className="absolute -right-0.5 -bottom-0.5 rounded-full border border-white bg-white text-green-500"
          size={SIZES[size].badge}
        />
      )}
    </div>
  );
};
