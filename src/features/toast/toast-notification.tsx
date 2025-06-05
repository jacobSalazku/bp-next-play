import { cn } from "@/utils/tw-merge";
import { Toaster as Sonner } from "sonner";

type ToastNotficationProps = {
  className?: string;
};

const Toaster = ({ className, ...props }: ToastNotficationProps) => {
  return (
    <Sonner
      position="top-center"
      className={cn(className, "bg-gray-800")}
      {...props}
    />
  );
};
export { Toaster };
