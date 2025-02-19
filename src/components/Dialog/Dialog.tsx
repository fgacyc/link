import React from "react";

interface DialogProps {
  isOpen: boolean;
  title: string;
  children?: React.ReactNode;
  vertical?: boolean;
  cancelText?: string;
  confirmText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
}

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  title,
  children,
  vertical = true,
  cancelText = "Cancel",
  confirmText = "Confirm",
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500/10">
      <div
        className="w-80 rounded-xl bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()} // 阻止冒泡，防止点击弹窗内部也触发关闭
      >
        {/* 标题 */}
        <h2 className="text-lg font-bold">{title}</h2>

        {/* 内容区域 */}
        <div className="mt-2 text-gray-600">{children}</div>

        {/* 按钮区域 */}
        {vertical ? (
          <div className="mt-4 flex flex-col space-y-4">
            <button
              className="rounded-full bg-black px-4 py-2 font-semibold text-white"
              onClick={onConfirm}
            >
              {confirmText}
            </button>
            <button
              className="font-semibold text-gray-700 hover:text-gray-900"
              onClick={onCancel}
            >
              {cancelText}
            </button>
          </div>
        ) : (
          <div className="mt-4 flex justify-end space-x-4">
            <button
              className="font-semibold text-gray-700 hover:text-gray-900"
              onClick={onCancel}
            >
              {cancelText}
            </button>
            <button
              className="rounded-lg bg-black px-4 py-2 font-semibold text-white"
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dialog;
