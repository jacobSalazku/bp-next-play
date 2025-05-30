import { Navigation } from "@/components/navigation";
import { TeamProvider } from "@/context/team-context";
import { TRPCReactProvider } from "@/trpc/react";
import { HydrateClient } from "@/trpc/server";

import "@/styles/globals.css";

export default async function TeamLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ teamId: string }>;
}>) {
  const { teamId } = await params;

  return (
    <TRPCReactProvider>
      <HydrateClient>
        <div className="w-full border-white">
          <TeamProvider teamSlug={teamId}>
            <Navigation>{children}</Navigation>
          </TeamProvider>
        </div>
      </HydrateClient>
    </TRPCReactProvider>
  );
}
