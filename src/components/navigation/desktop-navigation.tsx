"use client";

import { AuthLogoutModal } from "@/features/auth/components/auth-logout";
import { cn } from "@/lib/utils";
import useStore from "@/store/store";
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
  const { openLoginModal, setOpenLoginModal } = useStore();
  const { setPlayerSideBar } = useNavigationStore();

  const handleToggle = () => {
    onToggle();
    setPlayerSideBar(false);
  };

  return (
    <>
      <aside
        className={cn(
          "z-40 hidden flex-col border-r border-orange-200/30 bg-gray-950 pb-10 transition-all duration-300 md:flex",
          isOpen ? "w-64" : "w-16",
        )}
      >
        <div className="flex items-center justify-between border-b border-orange-200/30 px-4 py-6">
          <h2
            className={cn(
              "font-righteous text-2xl transition-opacity delay-1000 duration-300",
              isOpen ? "opacity-100" : "hidden",
            )}
          >
            NextPlay
          </h2>
          <button
            onClick={handleToggle}
            className={cn(
              !isOpen && "mx-auto",
              "cursor-pointer rounded p-2 transition-all hover:bg-gray-800",
            )}
          >
            <ChevronRight
              className={cn(
                isOpen && "rotate-180",
                "h-5 w-5 transition-transform duration-300",
              )}
            />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto bg-gray-950 py-4">
          <ul>
            {items.map((item, idx) => (
              <li key={idx}>
                <NavItem href={item.href} icon={item.icon}>
                  {isOpen && <span>{item.label}</span>}
                </NavItem>
              </li>
            ))}

            {openLoginModal && <AuthLogoutModal />}
          </ul>
        </nav>
        <Button
          className={cn(
            "flex w-full items-center px-4 py-3 text-sm transition-colors dark:hover:bg-gray-800",
            isOpen ? "justify-start" : "justify-center",
          )}
          onClick={() => setOpenLoginModal(true)}
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

      <main className="scrollbar-none relative flex w-full flex-col px-1 py-2 md:px-4">
        {children}
      </main>
    </>
  );
};
