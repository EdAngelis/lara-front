import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, useThemeColor, View } from "./Themed";

export interface RadioOption<T> {
  label: string;
  value: T;
  description?: string;
}

interface RadioGroupProps<T> {
  title: string;
  options: RadioOption<T>[];
  selectedValue: T;
  onValueChange: (value: T) => void;
  style?: any;
  row?: boolean;
}

export function RadioGroup<T>({
  title,
  options,
  selectedValue,
  onValueChange,
  style,
  row = false,
}: RadioGroupProps<T>) {
  const borderColor = useThemeColor({}, "tabIconDefault");
  const activeColor = useThemeColor({}, "tint");

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      <View
        style={[styles.optionsContainer, row && styles.optionsContainerRow]}
      >
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.option, row && styles.optionRow]}
            onPress={() => onValueChange(option.value)}
          >
            {row ? (
              // Column layout for row mode: label above radio
              <>
                <Text style={[styles.label, styles.labelAbove]}>
                  {option.label}
                </Text>
                <View
                  style={[
                    styles.radioButton,
                    styles.radioButtonCentered,
                    { borderColor },
                    selectedValue === option.value && {
                      borderColor: activeColor,
                    },
                  ]}
                >
                  {selectedValue === option.value && (
                    <Ionicons
                      name="radio-button-on"
                      size={20}
                      color={activeColor}
                    />
                  )}
                  {selectedValue !== option.value && (
                    <Ionicons
                      name="radio-button-off"
                      size={20}
                      color={borderColor}
                    />
                  )}
                </View>
              </>
            ) : (
              // Row layout for normal mode: radio beside label
              <>
                <View
                  style={[
                    styles.radioButton,
                    { borderColor },
                    selectedValue === option.value && {
                      borderColor: activeColor,
                    },
                  ]}
                >
                  {selectedValue === option.value && (
                    <Ionicons
                      name="radio-button-on"
                      size={20}
                      color={activeColor}
                    />
                  )}
                  {selectedValue !== option.value && (
                    <Ionicons
                      name="radio-button-off"
                      size={20}
                      color={borderColor}
                    />
                  )}
                </View>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>{option.label}</Text>
                  {option.description && (
                    <Text style={styles.description}>{option.description}</Text>
                  )}
                </View>
              </>
            )}
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
  optionsContainer: {
    gap: 8,
  },
  optionsContainerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  optionRow: {
    flex: 0,
    minWidth: 80,
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: "column",
    alignItems: "center",
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonCentered: {
    marginRight: 0,
    marginTop: 4,
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  labelAbove: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
});
