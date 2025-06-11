import { getUserById } from "@/api/user";
import withAuth from "@/features/auth/components/with-auth";
import PlayerDetailPanel from "@/features/player-table/components/player-detail-panel";
import { playerProfileSearchParamsCache } from "@/utils/search-params";

type PageProps = {
  searchParams: Promise<{
    id: string;
  }>;
};

const PlayerProfile = async ({ searchParams }: PageProps) => {
  const { id } = await playerProfileSearchParamsCache.parse(searchParams);
  const user = await getUserById(id);

  return <PlayerDetailPanel selectedPlayer={user} />;
};

export default withAuth(PlayerProfile);
