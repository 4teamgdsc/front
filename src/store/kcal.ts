import { create } from "zustand";

type Store = {
  kcal: number;

  addKcal: (kcal: number) => void;
};

export const useKcalStore = create<Store>()((set) => ({
  kcal: 0,

  addKcal: (kcal: number) => set((state) => ({ kcal: state.kcal + kcal })),
}));
