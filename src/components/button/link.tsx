import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";
import NavLink from "next/link";
import type { FC } from "react";
import { buttonVariants } from "./button";

export type LinkProps = {
  label?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  href: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof buttonVariants>;

const Link: FC<LinkProps> = ({
  className,
  size,
  variant,
  children,
  label,
  href = "",
  ...rest
}) => {
  return (
    <NavLink
      className={cn(
        buttonVariants({
          variant,
          className,
        }),
      )}
      href={href}
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
