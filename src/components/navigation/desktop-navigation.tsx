"use client";

import { AuthLogoutModal } from "@/features/auth/components/auth-logout";
import { cn } from "@/lib/utils";
import { useNavigationStore } from "@/store/use-navigation-store";
import { ChevronRight, LogOut } from "lucide-react";
import type { FC } from "react";
import type { NavItemType } from ".";
import { Button } from "../foundation/button/button";
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
  const { setPlayerSideBar, openLogOutModal, setOpenLogOutModal } =
    useNavigationStore();

  const handleToggle = () => {
    onToggle();
    setPlayerSideBar(false);
  };

  return (
    <>
      <aside
        className={cn(
          "relative z-40 hidden flex-col rounded-tl-2xl rounded-bl-2xl border-r border-orange-200/30 bg-white pb-10 text-gray-950 transition-all duration-300 md:flex",
          isOpen ? "w-64" : "w-16",
          "shadow-inner shadow-black/40",
        )}
      >
        <div className="flex items-center justify-between border-b border-orange-200/30 px-4 py-6">
          <h2
            className={cn(
              "font-righteous text-3xl font-bold transition-opacity delay-1000 duration-300",
              isOpen ? "opacity-100" : "hidden",
            )}
          >
            NextPlay
          </h2>
          <button
            onClick={handleToggle}
            className={cn(
              !isOpen && "mx-auto",
              "cursor-pointer rounded p-2 transition-all hover:bg-gray-800 hover:text-white",
            )}
          >
            <ChevronRight
              className={cn(
                isOpen && "rotate-180",
                "h-5 w-5 transition-transform duration-300 hover:text-white",
              )}
            />
          </button>
        </div>
        <nav className="flex-1 gap-2 overflow-y-auto py-4">
          <ul className="flex flex-col gap-1">
            {items.map((item, idx) => (
              <li key={idx}>
                <NavItem href={item.href} icon={item.icon}>
                  {isOpen && <span>{item.label}</span>}
                </NavItem>
              </li>
            ))}

            {openLogOutModal && <AuthLogoutModal />}
          </ul>
        </nav>
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
      </aside>

      <main className="scrollbar-none relative flex w-full flex-col bg-gradient-to-br from-black to-gray-900 px-1 py-2 text-white md:rounded-tl-2xl md:rounded-bl-xl md:px-4">
        {children}
      </main>
    </>
  );
};
