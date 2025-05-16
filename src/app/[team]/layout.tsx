import { getTeamActivities } from "@/api/team";
import { Navigation } from "@/components/navigation";

import { TRPCReactProvider } from "@/trpc/react";
import { HydrateClient } from "@/trpc/server";

export default async function TeamLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { team } = await getTeamActivities();

  return (
    <TRPCReactProvider>
      <HydrateClient>
        <main className="flex max-w-screen justify-center overflow-hidden bg-gray-950">
          <div className="w-screen max-w-7xl border-white">
            <Navigation team={team.name.toLowerCase()}>{children}</Navigation>
          </div>
        </main>
      </HydrateClient>
    </TRPCReactProvider>
  );
}
