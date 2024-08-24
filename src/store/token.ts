import { create } from "zustand";

type Store = {
  token: string;

  changeToken: (token: string) => void;
};

export const useTokenStore = create<Store>()((set) => ({
  token: "default",

  changeToken: (token: string) => set((state) => ({ token: token })),
}));
