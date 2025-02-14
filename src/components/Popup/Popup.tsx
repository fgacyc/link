import React from "react";

interface PopupProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    buttonText?: string;
    imageUrl?: string;
    showCheckmark?: boolean;
    children?: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({
                                         isOpen,
                                         onClose,
                                         title,
                                         buttonText = "Okay",
                                         imageUrl,
                                         showCheckmark = false,
                                         children,
                                     }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg w-80">
                {/* 图片部分 */}
                {imageUrl && (
                    <div className="relative w-16 h-16 mx-auto mb-4">
                        <img src={imageUrl} alt="Image" className="w-16 h-16 rounded-full" />
                        {showCheckmark && (
                            <span className="absolute bottom-0 right-0 bg-green-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs">
                ✔
              </span>
                        )}
                    </div>
                )}

                {/* 标题 */}
                <h2 className="text-lg font-bold">{title}</h2>

                {/* 描述内容（支持 HTML 传入）*/}
                <div className="text-gray-600 mt-2">{children}</div>

                {/* 按钮 */}
                <button
                    onClick={onClose}
                    className="mt-4 w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition"
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

export default Popup;
