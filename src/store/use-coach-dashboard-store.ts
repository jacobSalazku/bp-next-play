import type { CoachDashTab } from "@/features/play-book/utils/types";
import { create } from "zustand";

type DasboardState = {
  activeCoachTab: CoachDashTab;
  setActiveCoachTab: (value: CoachDashTab) => void;
};

export const useCoachDashboardStore = create<DasboardState>((set) => ({
  activeCoachTab: "gameplan",
  setActiveCoachTab: (activeCoachTab) => set({ activeCoachTab }),
}));
