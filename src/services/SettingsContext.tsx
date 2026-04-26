import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { UserSettings } from '@/types/bible';
import { DEFAULT_SETTINGS } from '@/constants/Defaults';
import { Colors, ThemeColors } from '@/constants/Colors';
import StorageService from './StorageService';

interface SettingsContextType {
  settings: UserSettings;
  colors: ThemeColors;
  updateSettings: (patch: Partial<UserSettings>) => Promise<void>;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_SETTINGS,
  colors: Colors.light,
  updateSettings: async () => {},
  isLoading: true,
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    StorageService.settings.get().then(saved => {
      setSettings(saved);
      setIsLoading(false);
    });
  }, []);

  const updateSettings = async (patch: Partial<UserSettings>) => {
    const updated = { ...settings, ...patch };
    setSettings(updated);
    await StorageService.settings.save(patch);
  };

  const colors = Colors[settings.theme] ?? Colors.light;

  return (
    <SettingsContext.Provider
      value={{ settings, colors, updateSettings, isLoading }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextType {
  return useContext(SettingsContext);
}