import { COLOR_SCHEMES } from "@/constants/ColorSchemes";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, useThemeColor, View } from "./Themed";

interface ColorSchemePickerProps {
  title: string;
  selectedValue: number;
  onValueChange: (value: number) => void;
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
        {COLOR_SCHEMES.map((scheme, index) => (
          <TouchableOpacity
            key={scheme.value}
            style={[
              styles.schemeOption,
              { borderColor },
              selectedValue === index && {
                borderColor: activeColor,
                borderWidth: 3,
              },
            ]}
            onPress={() => onValueChange(index)}
          >
            <View style={styles.colorPreview}>
              <View
                style={[
                  styles.colorSample,
                  { backgroundColor: scheme.letters },
                ]}
              />
              <View
                style={[
                  styles.colorSample,
                  { backgroundColor: scheme.background },
                ]}
              />
            </View>
            <Text
              style={[
                styles.schemeName,
                selectedValue === index && {
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
    borderColor: "#000",
  },
  schemeName: {
    fontSize: 12,
    textAlign: "center",
  },
});
