import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import type { FC } from "react";
import type { NavItemType } from ".";
import { NavItem } from "./nav-item";

type DesktopNavProps = {
  items: NavItemType[];
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

export const DesktopNavigation: FC<DesktopNavProps> = ({
  items,
  isOpen,
  onToggle,
  children,
}) => {
  return (
    <>
      <aside
        className={cn(
          "border-border bg-background z-40 hidden flex-col border-r bg-gray-950 transition-all duration-300 md:flex",
          isOpen ? "w-64" : "w-16",
        )}
      >
        <div className="border-border flex items-center justify-between border-b p-4 dark:border-gray-700">
          <h2
            className={cn(
              "font-righteous text-2xl font-semibold opacity-0 transition-opacity delay-300 duration-300",
              isOpen ? "opacity-100" : "hidden",
            )}
          >
            NextPlay
          </h2>

          <button
            onClick={onToggle}
            className={cn(
              !isOpen && "mx-auto",
              "hover:bg-muted rounded p-2 dark:hover:bg-gray-800",
            )}
          >
            <ChevronRight
              className={cn(
                isOpen ? "rotate-180" : null,
                "h-5 w-5 transition-transform duration-300",
              )}
            />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto bg-gray-950 py-4">
          <ul className="space-y-1">
            {items.map((item, idx) => (
              <li key={idx}>
                <NavItem href={item.href} icon={item.icon}>
                  {isOpen && <span>{item.label}</span>}
                </NavItem>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-4">{children}</main>
    </>
  );
};
