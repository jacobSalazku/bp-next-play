import { cn } from "@/lib/utils";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { forwardRef } from "react";

type TabsTriggerProps = React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.Trigger
> & {
  active?: string;
  inActive?: string;
};

const defaultActive =
  "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg rounded-md";

const defaultInActive =
  "text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition ease-in-out duration-150";

const TabsTrigger = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(
  (
    { className, active = defaultActive, inActive = defaultInActive, ...props },
    ref,
  ) => (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center rounded-md px-3",
        "py-1 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2",
        "focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow",
        ...inActive.split(" ").map((cls) => `data-[state=inactive]:${cls}`),
        ...active.split(" ").map((cls) => `data-[state=active]:${cls}`),
        className,
      )}
      {...props}
    />
  ),
);
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
export { TabsTrigger };
