"use client";

import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

const TableHead = ({ className, ...props }: ComponentProps<"th">) => {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}
    />
  );
};
export { TableHead };
