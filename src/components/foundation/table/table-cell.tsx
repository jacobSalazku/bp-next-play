"use client";

import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

const TableCell = ({ className, ...props }: ComponentProps<"td">) => {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}
    />
  );
};

export { TableCell };
