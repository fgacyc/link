import React from "react";
import { GoCheckCircleFill } from "react-icons/go";

interface ProfileIconProps {
  imageUrl: string;
  isVerified?: boolean;
  size?: "mini" | "small" | "medium" | "large";
  alt?: string;
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
}) => {
  return (
    <div
      className="relative"
      style={{
        width: `${SIZES[size].container}px`,
        height: `${SIZES[size].container}px`,
      }}
    >
      <img
        src={imageUrl}
        alt={alt}
        className={`h-full w-full rounded-full border border-white bg-white object-cover ${size === "mini" ? "p-px" : size === "small" ? "p-0.5" : "p-1"}`}
      />
      {isVerified && (
        <GoCheckCircleFill
          className="absolute -right-0.5 -bottom-0.5 rounded-full border border-white text-green-500"
          size={SIZES[size].badge}
        />
      )}
    </div>
  );
};
