import React from "react";
import { ButtonGroup } from "../ButtonGroup";

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
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-gray-500/10 transition-opacity duration-200 ease-in-out ${
        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div
        className="flex w-80 flex-col gap-5 rounded-xl bg-white p-5 shadow-lg"
        onClick={(e) => e.stopPropagation()} // 阻止冒泡，防止点击弹窗内部也触发关闭
      >
        <div className="flex flex-col gap-1">
          {/* 标题 */}
          <h2 className="text-lg font-bold">{title}</h2>

          {/* 内容区域 */}
          <div className="text-gray-600">{children}</div>
        </div>
        {/* 按钮区域 */}
        {vertical ? (
          <ButtonGroup
            direction="row"
            rounded="small"
            btns={[
              {
                label: confirmText,
                onClick: () => {
                  console.log("confirm");
                  onConfirm?.();
                },
                variant: "primary",
              },
              {
                label: cancelText,
                onClick: () => {
                  console.log("cancel");
                  onCancel?.();
                },
                variant: "secondary",
              },
            ]}
          />
        ) : (
          <div className="flex justify-end space-x-4">
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
