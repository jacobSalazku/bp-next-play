import { cn } from "@/utils/tw-merge";
import { forwardRef } from "react";
import { type FieldError, type UseFormRegisterReturn } from "react-hook-form";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: FieldError;
  errorMessage?: string;
  register?: UseFormRegisterReturn;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      label,
      error,
      errorMessage,
      register,
      className,
      type = "text",
      ...props
    },
    ref,
  ) => {
    return (
      <div className="space-y-2">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-white dark:text-gray-200"
        >
          {label}
        </label>
        <input
          id={id}
          type={type}
          className={cn(
            "w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none",
            "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus-visible:ring-red-500",
            className,
          )}
          ref={ref}
          {...register}
          {...props}
        />
        {error && errorMessage && (
          <p className="text-sm text-red-500">{errorMessage}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
