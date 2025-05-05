import type { Team } from "@prisma/client";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Link } from "../button/link";

function TeamCard({ team }: { team: Team }) {
  return (
    <div className="mx-auto w-full max-w-md cursor-pointer rounded-2xl border border-gray-500 p-5 text-blue-200 shadow-sm transition-shadow hover:shadow-md">
      <div className="border-b border-white/10 pb-3">
        <div className="flex items-center justify-between">
          <h2 className="truncate text-lg font-semibold">{team.name}</h2>
          <span className="rounded border border-white/20 px-2 py-0.5 text-sm text-white/80">
            U14
          </span>
        </div>
        <p className="mt-1 text-sm text-white/60">12 players</p>
      </div>
      <div className="space-y-3 py-4 text-sm text-white/90">
        <div className="flex justify-between">
          <span className="font-medium text-white">Next Activity:</span>
          <span className="text-white/80">vs Gembo BBC</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-white/40" />4 June
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-white/40" />
            19:00
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-white/40" />
          <span className="text-white/60">Sportschuur</span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 pt-4">
        <div className="flex gap-2 text-sm">
          <span className="rounded bg-white/10 px-2 py-0.5 text-white">5W</span>
          <span className="rounded border border-white/20 px-2 py-0.5 text-white">
            1L
          </span>
        </div>
        <Link
          href={`${team.name.toLowerCase()}/schedule`}
          aria-label={`View ${team.name} details`}
          variant="outline"
        >
          View Team
        </Link>
      </div>
    </div>
  );
}

export default TeamCard;
