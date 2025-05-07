import type { Activity } from "@prisma/client";
import { create } from "zustand";

type StoreState = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;

  selectedActivity: Activity | null;
  setSelectedActivity: (activity: Activity | null) => void;

  openGameModal: boolean;
  setOpenGameModal: (open: boolean) => void;

  openPracticeModal: boolean;
  setOpenPracticeModal: (open: boolean) => void;

  openGameDetails: boolean;
  setOpenGameDetails: (open: boolean) => void;

  openPracticeDetails: boolean;
  setOpenPracticeDetails: (open: boolean) => void;
};

const useStore = create<StoreState>((set) => ({
  selectedDate: new Date(),
  setSelectedDate: (date) => set({ selectedDate: date }),
  selectedActivity: null,
  setSelectedActivity: (activity) => set({ selectedActivity: activity }),

  // Game and Practice Modals
  openGameModal: false,
  setOpenGameModal: (open) => set({ openGameModal: open }),
  openPracticeModal: false,
  setOpenPracticeModal: (open) => set({ openPracticeModal: open }),

  // Game and Practice Details
  openGameDetails: false,
  setOpenGameDetails: (open) => set({ openGameDetails: open }),
  openPracticeDetails: false,
  setOpenPracticeDetails: (open) => set({ openPracticeDetails: open }),
}));

export default useStore;
