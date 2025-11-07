import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, useThemeColor, View } from "./Themed";

interface ColorScheme {
  name: string;
  colors: string[];
  value: string;
}

const colorSchemes: ColorScheme[] = [
  {
    name: "Default",
    colors: ["#007AFF", "#34C759", "#FF9500"],
    value: "default",
  },
  { name: "Warm", colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"], value: "warm" },
  { name: "Cool", colors: ["#6C5CE7", "#A29BFE", "#74B9FF"], value: "cool" },
  {
    name: "Monochrome",
    colors: ["#2D3436", "#636E72", "#B2BEC3"],
    value: "monochrome",
  },
  {
    name: "Vibrant",
    colors: ["#E17055", "#FDCB6E", "#6C5CE7"],
    value: "vibrant",
  },
];

interface ColorSchemePickerProps {
  title: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  style?: any;
}

export function ColorSchemePicker({
  title,
  selectedValue,
  onValueChange,
  style,
}: ColorSchemePickerProps) {
  const borderColor = useThemeColor({}, "tabIconDefault");
  const activeColor = useThemeColor({}, "tint");

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.schemesContainer}>
        {colorSchemes.map((scheme) => (
          <TouchableOpacity
            key={scheme.value}
            style={[
              styles.schemeOption,
              { borderColor },
              selectedValue === scheme.value && {
                borderColor: activeColor,
                borderWidth: 3,
              },
            ]}
            onPress={() => onValueChange(scheme.value)}
          >
            <View style={styles.colorPreview}>
              {scheme.colors.map((color, index) => (
                <View
                  key={index}
                  style={[styles.colorSample, { backgroundColor: color }]}
                />
              ))}
            </View>
            <Text
              style={[
                styles.schemeName,
                selectedValue === scheme.value && {
                  color: activeColor,
                  fontWeight: "600",
                },
              ]}
            >
              {scheme.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  schemesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  schemeOption: {
    borderWidth: 2,
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
    minWidth: 80,
  },
  colorPreview: {
    flexDirection: "row",
    marginBottom: 8,
  },
  colorSample: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginHorizontal: 1,
  },
  schemeName: {
    fontSize: 12,
    textAlign: "center",
  },
});
