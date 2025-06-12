import { Navigation } from "@/components/navigation";
import { TeamProvider } from "@/context/team-context";
import { TRPCReactProvider } from "@/trpc/react";
import { HydrateClient } from "@/trpc/server";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

import "@/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_BASE_URL ?? ""),
  title: {
    default: "Next Play ",
    template: " %s | Next Play",
  },
  icons: [
    {
      url: "/next-play-logo.png",
    },
  ],
  description:
    "Next Play is a platform for sports teams to manage their team, schedule matches, and track statistics.",

  openGraph: {
    type: "website",
    url: `${process.env.NEXT_BASE_URL}`,
    title: "Next Play",
    description:
      "Next Play is a platform for sports teams to manage their team, schedule matches, and track statistics.",
    images: [
      {
        url: "/next-play-logo.png",
        width: 48,
        height: 48,
        alt: "Next Play Logo",
      },
    ],
  },
};

export default async function TeamLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ teamId: string }>;
}>) {
  const { teamId } = await params;

  return (
    <SessionProvider>
      <TRPCReactProvider>
        <HydrateClient>
          <div className="font-roboto flex w-screen justify-center overflow-hidden bg-gray-950">
            <div className="w-full border-white">
              <TeamProvider teamSlug={teamId}>
                <Navigation>{children}</Navigation>
                <Toaster />
              </TeamProvider>
            </div>
          </div>
        </HydrateClient>
      </TRPCReactProvider>
    </SessionProvider>
  );
}
