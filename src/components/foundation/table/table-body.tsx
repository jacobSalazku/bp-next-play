"use client";

import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

const TableBody = ({ className, ...props }: ComponentProps<"tbody">) => {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
};

export { TableBody };
