import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { Text, useThemeColor, View } from "./Themed";

interface CheckboxProps {
  label: string;
  value: string;
  checked: boolean;
  onToggle: (value: string) => void;
}

export function Checkbox({ label, value, checked, onToggle }: CheckboxProps) {
  const iconColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({}, "tabIconDefault");
  const checkedColor = useThemeColor({}, "tint");

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onToggle(value)}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.checkbox,
          { borderColor: checked ? checkedColor : borderColor },
          checked && { backgroundColor: checkedColor },
        ]}
      >
        {checked && <Ionicons name="checkmark" size={16} color="white" />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
});
