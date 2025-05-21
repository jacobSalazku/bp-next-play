"use client";

import { useTeam } from "@/context/team-context";
import { useNavRoute } from "@/hooks/use-nav-route";
import { useNavigationStore } from "@/store/use-navigation-store";
import { Calendar, Home, Menu, User, type LucideIcon } from "lucide-react";
import { type FC } from "react";
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
  ];
  const title = useNavRoute();

  return (
    <div className="flex h-screen flex-col bg-gray-950 text-gray-100">
      <header className="flex items-center justify-between border-b border-gray-800 p-4 md:hidden">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="rounded p-2 hover:bg-gray-800"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
      </header>
      {mobileNavOpen && (
        <MobileNav items={navItems} onClose={() => setMobileNavOpen(false)} />
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
