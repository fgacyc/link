import React from 'react';

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
  alt = 'Profile picture'
}) => {
  return (
    <div className="relative" style={{ width: `${size}px`, height: `${size}px` }}>
      <img
        src={imageUrl}
        alt={alt}
        className="w-full h-full rounded-full object-cover ring-1 ring-black"
      />
      {isVerified && (
        <div
          className="absolute bottom-0 right-0 bg-green-500 rounded-full border-2 border-white ring-1 ring-black flex items-center justify-center"
          style={{ 
            width: `${size * 0.3}px`, 
            height: `${size * 0.3}px`,
            fontSize: `${size * 0.2}px`
          }}
        >
          <span className="text-white">✓</span>
        </div>
      )}
    </div>
  );
};

export default ProfileIcon;