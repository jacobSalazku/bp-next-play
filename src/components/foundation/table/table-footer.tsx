"use client";

import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

const TableFooter = ({ className, ...props }: ComponentProps<"tfoot">) => {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className,
      )}
      {...props}
    />
  );
};

export { TableFooter };
