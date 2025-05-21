"use client";

import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

const Table = ({ className, ...props }: ComponentProps<"table">) => {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
};

export { Table };
