import React from "react";
import { StyleSheet, Switch } from "react-native";
import { Text, useThemeColor, View } from "./Themed";

interface ToggleSwitchProps {
  title: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  style?: any;
}

export function ToggleSwitch({
  title,
  description,
  value,
  onValueChange,
  style,
}: ToggleSwitchProps) {
  const activeColor = useThemeColor({}, "tint");

  return (
    <View style={[styles.container, style]}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#767577", true: activeColor + "80" }}
        thumbColor={value ? activeColor : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
});
