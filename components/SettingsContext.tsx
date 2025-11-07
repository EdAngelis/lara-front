import React, { createContext, ReactNode, useContext, useState } from "react";

export type GameMode = "assertive" | "comparison";
export type GameType = "letter" | "number" | "shape";
export type Size = 0 | 1 | 2 | 3 | 4;

export interface GameSettings {
  mode: GameMode;
  type: GameType;
  size: Size;
  colorScheme: number;
  toPractice: string[];
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
  mode: "assertive",
  type: "letter",
  size: 2,
  colorScheme: 0,
  toPractice: [],
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
