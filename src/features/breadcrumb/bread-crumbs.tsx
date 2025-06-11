"use client";

import { Button } from "@/components/foundation/button/button";
import { Link } from "@/components/foundation/button/link";
import { useGetUser } from "@/hooks/use-get-user";
import { cn } from "@/lib/utils";
import { useNavigationStore } from "@/store/use-navigation-store";
import { ChevronRight, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const capitalize = (text: string) =>
  text.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

export const Breadcrumb = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const { setOpenLogOutModal } = useNavigationStore();
  const user = useGetUser();
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const visibleSegments = segments.slice(1);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!visibleSegments.length) return null;

  return (
    <div className="-mx-4 mb-4 hidden items-center justify-between gap-2 border-b border-orange-200/30 py-4 pt-3.5 pl-4 text-sm text-orange-200 md:flex">
      {visibleSegments.map((segment, index) => {
        const label = capitalize(segment);
        const isLast = index === visibleSegments.length - 1;

        const href = "/" + segments.slice(0, index + 2).join("/");

        return (
          <div className="-mr-5 flex items-center gap-2 px-2" key={index}>
            {index > 0 && <ChevronRight className="h-6 w-6" />}
            {isLast ? (
              <span
                className={cn("text-orange-300", "font-righteous text-2xl")}
              >
                {label}
              </span>
            ) : (
              <Link
                aria-label={label}
                href={href}
                className="font-righteous bg:hover-text bg-transparent text-2xl transition-colors duration-200 hover:bg-transparent hover:text-orange-300"
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}

      <div
        className="relative ml-auto pr-6 text-xs text-white"
        ref={dropdownRef}
      >
        <button
          aria-label="dropdown settings"
          onClick={() => setOpen((prev) => !prev)}
          className="flex cursor-pointer items-center gap-2 rounded-full border border-white/20 px-4 py-2 hover:bg-gray-600"
        >
          <User className="h-5 w-5" />
          <span>{user[0]?.user.name ?? "User"}</span>
        </button>

        {open && (
          <div className="absolute right-0 z-50 mt-2 w-48 rounded-md p-2 shadow-lg">
            <Link
              aria-label="go back to dashboard"
              href="/"
              className="block w-full rounded px-4 py-2 text-white hover:bg-gray-700 hover:text-white"
            >
              Go back to Dashboard
            </Link>
            <Button
              aria-label="logout"
              className="block w-full rounded px-4 py-2 text-left text-white hover:bg-gray-700 hover:text-white"
              onClick={() => {
                setOpen(false);
                setOpenLogOutModal(true);
              }}
            >
              Logout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
