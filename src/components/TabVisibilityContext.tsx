import React, { createContext, ReactNode, useContext, useState } from "react";

interface TabVisibilityContextType {
  isTabBarVisible: boolean;
  showTabBar: () => void;
  hideTabBar: () => void;
  toggleTabBar: () => void;
}

const TabVisibilityContext = createContext<
  TabVisibilityContextType | undefined
>(undefined);

interface TabVisibilityProviderProps {
  children: ReactNode;
}

export function TabVisibilityProvider({
  children,
}: TabVisibilityProviderProps) {
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);

  const showTabBar = () => setIsTabBarVisible(true);
  const hideTabBar = () => setIsTabBarVisible(false);
  const toggleTabBar = () => setIsTabBarVisible((prev) => !prev);

  return (
    <TabVisibilityContext.Provider
      value={{
        isTabBarVisible,
        showTabBar,
        hideTabBar,
        toggleTabBar,
      }}
    >
      {children}
    </TabVisibilityContext.Provider>
  );
}

export function useTabVisibility() {
  const context = useContext(TabVisibilityContext);
  if (context === undefined) {
    throw new Error(
      "useTabVisibility must be used within a TabVisibilityProvider"
    );
  }
  return context;
}
