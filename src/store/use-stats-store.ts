import type { PlayerStatRow } from "@/features/statistics/types";
import { create } from "zustand";

type StatisticsStore = {
  selectedPlayerStatistics: PlayerStatRow | null;
  setSelectedPlayerStatistics: (
    selectedPlayerStatistics: PlayerStatRow | null,
  ) => void;
};

export const useStatisticsStore = create<StatisticsStore>((set) => ({
  selectedPlayerStatistics: null,
  setSelectedPlayerStatistics: (PlayerStatRow) =>
    set({ selectedPlayerStatistics: PlayerStatRow }),
}));
