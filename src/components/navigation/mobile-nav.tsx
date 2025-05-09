import { X } from "lucide-react";
import type { NavItemType } from ".";
import { NavItem } from "./nav-item";

type MobileNavProps = {
  items: NavItemType[];
  onClose: () => void;
};

export function MobileNav({ items, onClose }: MobileNavProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm md:hidden">
      <div className="bg-background absolute top-0 left-0 flex h-full w-[250px] flex-col bg-neutral-900 p-4 shadow-lg">
        <div className="border-border mb-4 flex items-center justify-between border-b pb-2 dark:border-gray-700">
          <h2 className="text-lg font-bold">Team Manager</h2>
          <button
            onClick={onClose}
            className="hover:bg-muted rounded p-1 dark:hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {items.map((item, idx) => (
              <NavItem key={idx} {...item} onClick={onClose}>
                {item.label}
              </NavItem>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
