"use client";
import { createContext, useContext } from "react";

const TeamContext = createContext<{ teamSlug: string } | null>(null);

export function TeamProvider({
  teamSlug,
  children,
}: {
  teamSlug: string;
  children: React.ReactNode;
}) {
  return (
    <TeamContext.Provider value={{ teamSlug }}>{children}</TeamContext.Provider>
  );
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (!context) throw new Error("useTeam must be used within a TeamProvider");
  return context;
}
