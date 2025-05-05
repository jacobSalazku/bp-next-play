import { Navigation } from "@/components/navigation";
import { TRPCReactProvider } from "@/trpc/react";
import { HydrateClient } from "@/trpc/server";

export default async function TeamLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <TRPCReactProvider>
      <HydrateClient>
        <main className="flex max-w-screen justify-center bg-black">
          <div className="w-screen max-w-7xl border-2 border-white">
            <Navigation>{children}</Navigation>
          </div>
        </main>
      </HydrateClient>
    </TRPCReactProvider>
  );
}
