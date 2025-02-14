import React from "react";

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children?: React.ReactNode;
    cancelText?: string;
    confirmText?: string;
    onCancel?: () => void;
    onConfirm?: () => void;
    isModal?: boolean; // 是否允许点击外部关闭
}

const Dialog: React.FC<DialogProps> = ({
                                           isOpen,
                                           onClose,
                                           title,
                                           children,
                                           cancelText = "Cancel",
                                           confirmText = "Confirm",
                                           onCancel,
                                           onConfirm,
                                           isModal = true,
                                       }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            onClick={!isModal ? onClose : undefined}
        >
            <div
                className="bg-white rounded-lg p-6 w-96 shadow-lg"
                onClick={(e) => e.stopPropagation()} // 阻止冒泡，防止点击弹窗内部也触发关闭
            >
                {/* 标题 */}
                <h2 className="text-lg font-bold">{title}</h2>

                {/* 内容区域 */}
                <div className="text-gray-600 mt-2">{children}</div>

                {/* 按钮区域 */}
                <div className="flex justify-end space-x-4 mt-4">
                    <button
                        className="text-gray-700 font-semibold hover:text-gray-900"
                        onClick={onCancel || onClose}
                    >
                        {cancelText}
                    </button>
                    <button
                        className="bg-black text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dialog;
