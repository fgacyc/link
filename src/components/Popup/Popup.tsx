import React from "react";

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500/10">
      <div className="w-80 rounded-xl bg-white p-6 text-center shadow-lg">
        {/* 图片部分 */}
        {imageUrl && (
          <div className="relative mx-auto mb-4 h-16 w-16">
            <img
              src={imageUrl}
              alt="Image"
              className="h-16 w-16 rounded-full"
            />
          </div>
        )}

        {/* 标题 */}
        <h2 className="text-lg font-bold">{title}</h2>

        {/* 描述内容（支持 HTML 传入）*/}
        <div className="mt-2 text-gray-600">{children}</div>

        {/* 按钮 */}
        <button
          onClick={onClose}
          className="mt-4 w-full rounded-full bg-black py-2 font-semibold text-white"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Popup;
