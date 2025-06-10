"use client";

import { useTeam } from "@/context/team-context";
import { useNavRoute } from "@/hooks/use-nav-route";
import { useNavigationStore } from "@/store/use-navigation-store";
import {
  BookOpen,
  Calendar,
  ChartArea,
  Home,
  Menu,
  User,
  X,
  type LucideIcon,
} from "lucide-react";
import { type FC } from "react";
import { Button } from "../foundation/button/button";
import { DesktopNavigation } from "./desktop-navigation";
import { MobileNav } from "./mobile-nav";

export type NavItemType = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type NavigationProps = {
  children: React.ReactNode;
};

const Navigation: FC<NavigationProps> = ({ children }) => {
  const { teamSlug } = useTeam();

  const { navOpen, setNavOpen, setMobileNavOpen, mobileNavOpen } =
    useNavigationStore();

  const navItems = [
    {
      label: "Dashboard",
      href: `/${teamSlug}/dashboard`,
      icon: Home,
      active: true,
    },
    {
      label: "Players",
      href: `/${teamSlug}/players`,
      icon: User,
      active: false,
    },
    {
      label: "Schedule",
      href: `/${teamSlug}/schedule`,
      icon: Calendar,
      active: false,
    },
    {
      label: "Statistics",
      href: `/${teamSlug}/statistics`,
      icon: ChartArea,
      active: false,
    },
    {
      label: "Playbook",
      href: `/${teamSlug}/playbook-library`,
      icon: BookOpen,
      active: false,
    },
  ];

  const title = useNavRoute();
  const { playerSideBar, setPlayerSideBar } = useNavigationStore();

  return (
    <div className="flex h-screen flex-col bg-white text-gray-950">
      <header className="flex items-center justify-between border-b border-orange-200/30 p-4 md:hidden">
        <div className="flex w-full items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="cursor-pointer rounded p-2 transition-colors duration-300 hover:bg-gray-900 hover:text-white"
            >
              <Menu className="py h-5 w-5" />
            </button>
            <h1 className="font-righteous text-xl font-bold">{title}</h1>
          </div>
          {playerSideBar && (
            <Button variant="close" onClick={() => setPlayerSideBar(false)}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </header>
      {mobileNavOpen && (
        <MobileNav
          items={navItems}
          onClose={() => setMobileNavOpen(false)}
          isOpen={navOpen}
        />
      )}
      <div className="flex flex-1 overflow-hidden">
        <DesktopNavigation
          items={navItems}
          isOpen={navOpen}
          onToggle={() => setNavOpen(!navOpen)}
        >
          {children}
        </DesktopNavigation>
      </div>
    </div>
  );
};

export { Navigation };
