"use client";

import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Menu,
  Search,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

const Navigation = ({ children }: { children: React.ReactNode }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(true);

  const navItems = [
    { label: "Dashboard", href: "/", icon: Home, active: true },
    { label: "Profile", href: "/profile", icon: User, active: false },
  ];

  return (
    <div className="bg-background text-foreground flex h-screen flex-col dark:bg-gray-900 dark:text-gray-100">
      {/* Mobile Header */}
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

      {/* Mobile Sidebar Overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900 md:hidden">
          <div className="bg-background absolute top-0 left-0 flex h-full w-[250px] flex-col bg-neutral-900 p-4 shadow-lg">
            <div className="border-border mb-4 flex items-center justify-between border-b pb-2 dark:border-gray-700">
              <h2 className="text-lg font-bold">Team Manager</h2>
              <button
                onClick={() => setMobileNavOpen(false)}
                className="hover:bg-muted rounded p-1 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto">
              <ul className="space-y-1">
                {navItems.map((item, idx) => (
                  <li key={idx}>
                    <a
                      href={item.href}
                      className={cn(
                        "hover:bg-muted flex items-center px-4 py-3 text-sm transition-colors dark:hover:bg-gray-800",
                        item.active && "bg-muted dark:bg-gray-800",
                      )}
                      onClick={() => setMobileNavOpen(false)}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        <aside
          className={cn(
            "border-border bg-background z-40 hidden flex-col border-r bg-neutral-950 transition-all duration-300 md:flex",
            navOpen ? "w-64" : "w-16",
          )}
        >
          <div className="border-border flex items-center justify-between border-b p-4 dark:border-gray-700">
            {navOpen && <h2 className="text-lg font-bold">Team Manager</h2>}
            <button
              onClick={() => setNavOpen(!navOpen)}
              className={cn(
                "hover:bg-muted rounded p-2 dark:hover:bg-gray-800",
                !navOpen && "mx-auto",
              )}
            >
              {navOpen ? (
                <ChevronLeft className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1">
              {navItems.map((item, idx) => (
                <li key={idx}>
                  <a
                    href={item.href}
                    className={cn(
                      "hover:bg-muted flex items-center px-4 py-3 text-sm transition-colors dark:hover:bg-gray-800",
                      item.active && "bg-muted bg-neutral-800",
                    )}
                  >
                    <item.icon
                      className={cn("h-5 w-5", navOpen ? "mr-3" : "mx-auto")}
                    />
                    {navOpen && <span>{item.label}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
};

export { Navigation };
