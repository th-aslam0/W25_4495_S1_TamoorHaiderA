import { create } from "zustand";
import { Account, User } from "./types";

type Store = {
  user: User | null;
  setUser: (user: User | null) => void;

  accounts: Account[] | [];
  setAccounts: (accounts: Account[] | []) => void;
};

const useStateStore = create<Store>((set) => ({
  user: null,
  accounts: [],
  setUser: (user) => set({ user }),
  setAccounts: (accounts) => set({ accounts }),
}));

export default useStateStore;
