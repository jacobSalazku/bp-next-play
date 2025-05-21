import { Navigation } from "@/components/navigation";
import { TeamProvider } from "@/context/team-context";
import { TRPCReactProvider } from "@/trpc/react";
import { HydrateClient } from "@/trpc/server";

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
        <main className="flex w-screen justify-center overflow-hidden bg-gray-950">
          <div className="w-full max-w-7xl border-white">
            <TeamProvider teamSlug={teamId}>
              <Navigation>{children}</Navigation>
            </TeamProvider>
          </div>
        </main>
      </HydrateClient>
    </TRPCReactProvider>
  );
}
