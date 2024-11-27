import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Settings {
  notifications: {
    stockAlerts: boolean;
    movementSummary: boolean;
  };
  theme: 'light' | 'dark';
}

interface SettingsStore {
  settings: Settings;
  updateSettings: (newSettings: Settings) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: {
        notifications: {
          stockAlerts: false,
          movementSummary: false,
        },
        theme: 'light',
      },
      updateSettings: (newSettings) => set({ settings: newSettings }),
    }),
    {
      name: 'settings-storage',
    }
  )
);
