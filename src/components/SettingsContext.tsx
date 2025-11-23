import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type GameType = "letter" | "number" | "shape";
export type Size = 0 | 1 | 2 | 3 | 4;

export interface GameSettings {
  type: GameType;
  size: Size;
  colorScheme: number;
  toPractice: string[];
  onlySelected: boolean;
  audio: boolean;
  numberOfItems: 1 | 2 | 3 | 4;
  numberOfCircles: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
}

interface SettingsContextType {
  settings: GameSettings;
  updateSetting: <K extends keyof GameSettings>(
    key: K,
    value: GameSettings[K]
  ) => void;
  resetSettings: () => void;
}

const defaultSettings: GameSettings = {
  type: "letter",
  size: 2,
  colorScheme: 0,
  toPractice: [],
  onlySelected: false,
  audio: true,
  numberOfItems: 2,
  numberOfCircles: 3,
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);

  const updateSetting = <K extends keyof GameSettings>(
    key: K,
    value: GameSettings[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // When the game type changes, clear the onlySelected flag
  useEffect(() => {
    if (settings.onlySelected) {
      setSettings((prev) => ({ ...prev, onlySelected: false }));
    }
    // only run when type changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.type]);

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSetting,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
