import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItemProps = {
  href: string;
  icon: LucideIcon;
  children: React.ReactNode;
  isCollapsed?: boolean;
  onClick?: () => void;
};
export function NavItem({
  href,
  icon: Icon,
  children,
  isCollapsed,
  onClick,
}: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex w-full items-center bg-gray-950 px-4 py-7 text-sm transition-colors hover:bg-gray-800 hover:text-orange-300",
        isCollapsed ? "justify-center" : "justify-start",
        isActive && "bg-gray-800 font-medium hover:bg-gray-800",
      )}
    >
      <Icon className={cn("h-5 w-5", isCollapsed ? "mx-auto block" : "mr-3")} />
      {!isCollapsed && <span>{children}</span>}
    </Link>
  );
}
