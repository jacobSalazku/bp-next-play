"use client";

import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

const TableHeader = ({ className, ...props }: ComponentProps<"thead">) => {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  );
};
export { TableHeader };
