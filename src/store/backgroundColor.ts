import { create } from "zustand";

type Store = {
  color: string;

  changeColor: (color: string) => void;
};

export const useBackgroundStore = create<Store>()((set) => ({
  color: "default",

  changeColor: (color: string) => set((state) => ({ color: color })),
}));
