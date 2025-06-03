import { cn } from "@/lib/utils";
import { useNavigationStore } from "@/store/use-navigation-store";
import { LogOut, X } from "lucide-react";
import type { NavItemType } from ".";
import { Button } from "../foundation/button/button";
import { NavItem } from "./nav-item";

type MobileNavProps = {
  items: NavItemType[];
  onClose: () => void;
  isOpen: boolean;
};

export function MobileNav({ items, onClose, isOpen }: MobileNavProps) {
  const { mobileNavOpen, setOpenLogOutModal } = useNavigationStore();
  return (
    <div
      className={cn(
        mobileNavOpen && "backdrop-blur-md",
        "fixed inset-0 z-50 bg-black/20 md:hidden",
      )}
    >
      <div className="absolute top-0 left-0 flex h-full w-[250px] flex-col bg-gray-950 shadow-lg transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-between border-b border-orange-200/30 px-4 py-6">
          <h2 className="font-righteous text-2xl font-semibold transition-opacity delay-300 duration-300">
            NextPlay
          </h2>
          <Button
            variant="close"
            onClick={onClose}
            className="rounded p-2 text-white hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-1 pt-4">
            {items.map((item, idx) => (
              <NavItem key={idx} {...item} onClick={onClose}>
                {item.label}
              </NavItem>
            ))}
          </ul>
          <Button
            className={cn(
              "flex w-full items-center px-4 py-3 text-sm transition-colors dark:hover:bg-gray-800",
              isOpen ? "justify-start" : "justify-center",
            )}
            onClick={() => setOpenLogOutModal(true)}
          >
            <LogOut
              className={cn(
                "mr-2 h-5 w-5 rotate-180",
                !isOpen ? "mx-auto block" : "mr-1",
              )}
            />
            {isOpen && <span>Lougout</span>}
          </Button>
        </nav>
      </div>
    </div>
  );
}
