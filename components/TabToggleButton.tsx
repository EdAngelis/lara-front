import React, { useRef } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useTabVisibility } from "./TabVisibilityContext";
import { useThemeColor } from "./Themed";

interface TabToggleButtonProps {
  style?: any;
}

export function TabToggleButton({ style }: TabToggleButtonProps) {
  const { isTabBarVisible, toggleTabBar } = useTabVisibility();
  const iconColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");
  const count = useRef(0);
  return (
    <TouchableOpacity
      onPress={() => {
        count.current += 1;
        if (count.current === 7) {
          toggleTabBar();
          count.current = 0;
        }
      }}
      style={[
        styles.button,
        { backgroundColor: backgroundColor + "90" }, // Semi-transparent
        style,
      ]}
    ></TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 20,
    borderRadius: 20,
  },
});
