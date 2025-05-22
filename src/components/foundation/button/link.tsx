import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";
import NavLink from "next/link";
import type { FC } from "react";
import { buttonVariants } from "./button";

export type LinkProps = {
  label?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  href: Parameters<typeof NavLink>[0]["href"]; // ensure href is required and correct type
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> &
  VariantProps<typeof buttonVariants>;
const Link: FC<LinkProps> = ({
  className,
  variant,
  children,
  label,
  href,
  ...rest
}) => {
  return (
    <NavLink
      href={href}
      className={cn(
        buttonVariants({
          variant,
          className,
        }),
      )}
      {...rest}
      aria-label={label}
      prefetch
    >
      {label}
      {children}
    </NavLink>
  );
};

export { Link };
