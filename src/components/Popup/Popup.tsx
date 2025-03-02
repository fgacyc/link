import React from "react";
import ProfileIcon from "../ProfileIcon";
import { Button } from "../Button";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  buttonText?: string;
  imageUrl?: string;
  children?: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  title,
  buttonText = "Okay",
  imageUrl,
  children,
}) => {
  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gray-500/10 transition-opacity duration-200 ease-in-out ${
        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div
        className={`flex w-80 flex-col items-center gap-5 rounded-xl bg-white p-5 text-center shadow-lg`}
      >
        {/* 图片部分 */}
        {imageUrl ? (
          <ProfileIcon
            imageUrl={imageUrl}
            size={"small"}
            alt="Image"
            isVerified
          />
        ) : (
          <></>
        )}
        <div className="flex flex-col items-center gap-1">
          {/* 标题 */}
          <h2 className="text-lg font-bold">{title}</h2>
          {/* 描述内容（支持 HTML 传入）*/}
          <div className="text-gray-600">{children}</div>
        </div>
        {/* 按钮 */}
        <Button
          extendedPaddingY
          variant="primary"
          label={buttonText}
          onClick={onClose}
        />
      </div>
    </div>
  );
};

export default Popup;
