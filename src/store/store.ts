import { create } from "zustand";

type StoreState = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;

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
  setSelectedDate: (date: Date) => set({ selectedDate: date }),

  // Game and Practice Modals
  openGameModal: false,
  setOpenGameModal: (open: boolean) => set({ openGameModal: open }),
  openPracticeModal: false,
  setOpenPracticeModal: (open: boolean) => set({ openPracticeModal: open }),

  // Game and Practice Details
  openGameDetails: false,
  setOpenGameDetails: (open: boolean) => set({ openGameDetails: open }),
  openPracticeDetails: false,
  setOpenPracticeDetails: (open: boolean) => set({ openPracticeDetails: open }),
}));

export default useStore;
