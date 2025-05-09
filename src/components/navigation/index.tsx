"use client";

import {
  Calendar,
  Home,
  Menu,
  Search,
  User,
  type LucideIcon,
} from "lucide-react";
import { useState, type FC } from "react";
import { DesktopNavigation } from "./desktop-navigation";
import { MobileNav } from "./mobile-nav";

export type NavItemType = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type NavigationProps = {
  children: React.ReactNode;
  team: string;
};

const Navigation: FC<NavigationProps> = ({ children, team }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(true);

  const navItems = [
    {
      label: "Dashboard",
      href: `/${team}/dashboard`,
      icon: Home,
      active: true,
    },
    { label: "Profile", href: `/${team}/profile`, icon: User, active: false },
    {
      label: "Schedule",
      href: `/${team}/schedule`,
      icon: Calendar,
      active: false,
    },
    { label: "Logout", href: `/${team}/logout`, icon: User, active: false },
  ];

  return (
    <div className="bg-background text-foreground flex h-screen flex-col dark:bg-gray-950 dark:text-gray-100">
      <header className="border-border flex items-center justify-between border-b p-4 md:hidden dark:border-gray-700">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="hover:bg-muted rounded p-2 dark:hover:bg-gray-800"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold">Team Roster</h1>
        </div>
        <button className="hover:bg-muted rounded p-2 dark:hover:bg-gray-800">
          <Search className="h-5 w-5" />
        </button>
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
