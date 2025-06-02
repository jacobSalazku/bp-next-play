import type { TeamMember } from "@/types";
import { create } from "zustand";

type NavigationState = {
  playerSideBar: boolean;
  setPlayerSideBar: (open: boolean) => void;
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  navOpen: boolean;
  setNavOpen: (open: boolean) => void;
  selectedPlayer: TeamMember | null;
  setSelectedPlayer: (player: TeamMember | null) => void;
  openLogOutModal: boolean;
  setOpenLogOutModal: (open: boolean) => void;
};

export const useNavigationStore = create<NavigationState>((set) => ({
  playerSideBar: false,
  setPlayerSideBar: (open) => set({ playerSideBar: open }),

  navOpen: false,
  setNavOpen: (open) => set({ navOpen: open }),

  mobileNavOpen: false,
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),

  selectedPlayer: null,
  setSelectedPlayer: (player) => set({ selectedPlayer: player }),

  openLogOutModal: false,
  setOpenLogOutModal: (open) => set({ openLogOutModal: open }),
}));
