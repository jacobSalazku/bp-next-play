import { Button } from "@/components/foundation/button/button";
import { Link } from "@/components/foundation/button/link";
import { Card, CardContent, CardFooter } from "@/components/foundation/card";
import { CategoryBadge } from "@/components/foundation/category-badge";
import { useTeam } from "@/context/team-context";
import type { Play } from "@/types";
import { cn } from "@/utils/tw-merge";
import { Eye, Trash2 } from "lucide-react";
import Image from "next/image";
import { useDeletePlay } from "../../hooks/use-delete-play";
import { getCategoryColor } from "../../utils/play-catergory-color";

type PlayCardProps = {
  play: Play[number];
};

export const PlayCard = ({ play }: PlayCardProps) => {
  const { teamSlug } = useTeam();
  const deletePlay = useDeletePlay();

  const handleDelete = async () => {
    await deletePlay.mutateAsync({ teamId: teamSlug, playId: play.id });
  };

  return (
    <Card className="group relative cursor-pointer border border-gray-700 text-xs text-white transition-all duration-200 hover:border-orange-300/50">
      <div className="flex items-start justify-between px-4 py-4 md:px-0 md:py-1">
        <div className="flex w-full items-center justify-between gap-2 border-b border-gray-700 py-4 md:border-none md:px-6">
          <span className="text-2xl font-bold transition-colors group-hover:text-orange-400 md:hidden">
            {play.name}
          </span>
          <CategoryBadge
            label={play.category}
            className={cn(getCategoryColor(play.category))}
          />
        </div>
      </div>
      <CardContent className="pt-0">
        <div className="relative mb-4 hidden aspect-video overflow-hidden rounded-lg border border-gray-800 bg-gray-950 md:block">
          <Image
            src={play.canvas || "/placeholder.png"}
            alt={`Diagram for ${play.name}`}
            fill
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
        </div>
        <div className="group hidden flex-row items-center justify-between rounded-lg bg-gray-900 px-3 py-2 text-gray-300 transition-colors hover:bg-gray-800 md:flex">
          <span className="text-lg font-semibold text-gray-200 group-hover:text-orange-400">
            {play.name}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex w-full justify-between pt-0">
        <Link
          variant="light"
          size="sm"
          href={{
            pathname: `/${teamSlug}/playbook-library/play`,
            query: { id: play.id },
          }}
        >
          <Eye className="mr-1 h-3 w-3" />
          View Details
        </Link>
        <Button variant="danger" size="sm" onClick={handleDelete}>
          <Trash2 className="mr-1 h-3 w-3" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};
