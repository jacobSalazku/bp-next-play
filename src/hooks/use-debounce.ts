import type { PlayersData } from "@/features/scouting/components/multi-stats-tracker";
import { useEffect } from "react";

type SaveFn = (stats: PlayersData) => Promise<void>;

export function useDebouncedSave(
  stats: PlayersData | undefined,
  saveFn: SaveFn,
  delay: number, // default 1 minute
) {
  useEffect(() => {
    if (!stats) return;

    const handler = setTimeout(() => {
      saveFn(stats).catch((err) => {
        console.error("Failed to save stats:", err);
      });
    }, delay);

    return () => clearTimeout(handler);
  }, [stats, saveFn, delay]);
}
