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
                                         children
                                     }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500/10">
            <div className="bg-white rounded-xl p-6 text-center shadow-lg w-80">
                {/* 图片部分 */}
                {imageUrl && (
                    <div className="relative w-16 h-16 mx-auto mb-4">
                        <img src={imageUrl} alt="Image" className="w-16 h-16 rounded-full" />
                    </div>
                )}

                {/* 标题 */}
                <h2 className="text-lg font-bold">{title}</h2>

                {/* 描述内容（支持 HTML 传入）*/}
                <div className="text-gray-600 mt-2">{children}</div>

                {/* 按钮 */}
                <button
                    onClick={onClose}
                    className="mt-4 w-full bg-black text-white py-2 rounded-lg font-semibold"
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

export default Popup;
