import React from "react";
import { GoCheckCircleFill } from "react-icons/go";

interface ProfileIconProps {
  imageUrl: string;
  isVerified?: boolean;
  size?: "small" | "medium" | "large";
  alt?: string;
}

const SIZES = {
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
} as const;

const ProfileIcon: React.FC<ProfileIconProps> = ({
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
        className="h-full w-full rounded-full border border-white bg-white object-cover p-1"
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

export default ProfileIcon;
