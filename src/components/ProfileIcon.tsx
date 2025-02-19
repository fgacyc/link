import React from "react";

interface ProfileIconProps {
  imageUrl: string;
  isVerified?: boolean;
  size?: number;
  alt?: string;
}

const ProfileIcon: React.FC<ProfileIconProps> = ({
  imageUrl,
  isVerified = false,
  size = 48,
  alt = "Profile picture",
}) => {
  return (
    <div
      className="relative"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <img
        src={imageUrl}
        alt={alt}
        className="h-full w-full rounded-full object-cover ring-1 ring-black"
      />
      {isVerified && (
        <div
          className="absolute right-0 bottom-0 flex items-center justify-center rounded-full border-2 border-white bg-green-500 ring-1 ring-black"
          style={{
            width: `${size * 0.3}px`,
            height: `${size * 0.3}px`,
            fontSize: `${size * 0.2}px`,
          }}
        >
          <span className="text-white">✓</span>
        </div>
      )}
    </div>
  );
};

export default ProfileIcon;
