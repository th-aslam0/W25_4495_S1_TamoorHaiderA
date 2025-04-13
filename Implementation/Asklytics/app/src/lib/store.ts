import { create } from "zustand";
import { persist } from 'zustand/middleware'
import { Account, Property, User } from "./types";

type Store = {
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;

  user: User | null;
  setUser: (user: User | null) => void;

  accounts: Account[];
  setAccounts: (accounts: Account[]) => void;

  properties: Property[];
  setProperties: (properties: Property[]) => void;

  selectedProperty: Property | null;
  setSelectedProperty: (property: Property | null) => void;
};


const useStateStore = create<Store>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      accounts: [],
      properties: [],
      selectedProperty: null,

      setAccessToken: (accessToken) => set({ accessToken }),
      setUser: (user) => set({ user }),
      setAccounts: (accounts) => set({ accounts }),
      setProperties: (properties) => set({ properties }),
      setSelectedProperty: (selectedProperty) => set({ selectedProperty })
    }), { name: 'storage' }));

export default useStateStore;
