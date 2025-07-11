import React from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

interface PopupBaseProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string;
  children: React.ReactNode[] | React.ReactNode;
}

export default function PopupBase({
  open,
  setOpen,
  title,
  children,
}: PopupBaseProps) {
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="relative z-[998]"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/25 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-x-0 top-1/2 flex max-h-full -translate-y-1/2 p-12">
            <DialogPanel
              transition
              className="pointer-events-auto relative w-full transform transition duration-500 ease-in-out sm:duration-700"
            >
              <div className="flex h-full flex-col gap-5 overflow-y-scroll rounded-xl bg-white p-5 shadow-xl">
                <DialogTitle className="w-full text-center text-xl font-bold text-gray-900">
                  {title ?? ""}
                </DialogTitle>

                <div className="relative">{children}</div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
