import { getUserById } from "@/api/user";
import withAuth from "@/features/auth/components/with-auth";
import PlayerDetailPanel from "@/features/player-table/components/player-detail-panel";
import { playerProfileSearchParamsCache } from "@/utils/search-params";
import type { Metadata } from "next";

type PageProps = {
  searchParams: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { id } = await playerProfileSearchParamsCache.parse(searchParams);
  const user = await getUserById(id);
  return {
    title: `${user.user.name} Profile | Next Play`,
    description: "Check your profile and update your information.",
    openGraph: {
      title: `${user.user.name} Profile | Next Play`,
      description: "Check your profile and update your information.",
    },
  };
}

const PlayerProfile = async ({ searchParams }: PageProps) => {
  const { id } = await playerProfileSearchParamsCache.parse(searchParams);
  const user = await getUserById(id);

  return <PlayerDetailPanel selectedPlayer={user} />;
};

export default withAuth(PlayerProfile);
