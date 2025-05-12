"use client";

import { type FC, type ReactNode } from "react";

type ActivityModalProps = {
  title?: string;
  onClose: () => void;
  children: ReactNode;
};

export const ActivityModalWrapper: FC<ActivityModalProps> = ({
  title,
  onClose,
  children,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-md overflow-auto rounded-lg border border-gray-800 bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-800 p-4">
          <h2 className="text-lg font-normal sm:text-xl">{title}</h2>
          <button
            onClick={onClose}
            className="text-xl font-bold text-gray-400 hover:text-white"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="p-4text-white">{children}</div>
      </div>
    </div>
  );
};
