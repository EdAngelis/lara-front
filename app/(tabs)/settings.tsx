import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

import { Checkbox } from "@/components/Checkbox";
import { ColorSchemePicker } from "@/components/ColorSchemePicker";
import { RadioGroup } from "@/components/RadioGroup";
import {
  GameMode,
  GameType,
  Size,
  useSettings,
} from "@/components/SettingsContext";
import { Text, useThemeColor, View } from "@/components/Themed";
import { COLOR_SCHEMES } from "@/constants/ColorSchemes";

export default function SettingsScreen() {
  const { settings, updateSetting, resetSettings } = useSettings();
  const iconColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({}, "tabIconDefault");

  const letters = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  // Clear toPractice array when type changes
  useEffect(() => {
    updateSetting("toPractice", []);
  }, [settings.type]);

  const handleLetterToggle = (letter: string) => {
    const currentPractice = settings.toPractice;
    if (currentPractice.includes(letter)) {
      // Remove letter from array
      updateSetting(
        "toPractice",
        currentPractice.filter((l) => l !== letter)
      );
    } else {
      // Add letter to array
      updateSetting("toPractice", [...currentPractice, letter]);
    }
  };

  const handleNumberToggle = (number: string) => {
    const currentPractice = settings.toPractice;
    if (currentPractice.includes(number)) {
      // Remove number from array
      updateSetting(
        "toPractice",
        currentPractice.filter((n) => n !== number)
      );
    } else {
      // Add number to array
      updateSetting("toPractice", [...currentPractice, number]);
    }
  };

  const gameModeOptions = [
    {
      label: "Assertive Mode",
      value: "assertive" as GameMode,
      description: "Direct gameplay without comparisons",
    },
    {
      label: "Comparison Mode",
      value: "comparison" as GameMode,
      description: "Compare and choose between options",
    },
  ];

  const gameTypeOptions = [
    {
      label: "Letters",
      value: "letter" as GameType,
      description: "Practice with alphabet letters",
    },
    {
      label: "Numbers",
      value: "number" as GameType,
      description: "Practice with numeric values",
    },
    {
      label: "Shapes",
      value: "shape" as GameType,
      description: "Practice with geometric shapes",
    },
  ];

  const sizeOptions = [
    {
      label: "Very Easy",
      value: 0 as Size,
      description: "Simple patterns and basic concepts",
    },
    {
      label: "Easy",
      value: 1 as Size,
      description: "Simple patterns and basic concepts",
    },
    {
      label: "Medium",
      value: 2 as Size,
      description: "Moderate complexity challenges",
    },
    {
      label: "Hard",
      value: 3 as Size,
      description: "Advanced patterns and concepts",
    },
    {
      label: "Very Hard",
      value: 4 as Size,
      description: "Advanced patterns and concepts",
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <TouchableOpacity
            style={[styles.resetButton, { borderColor }]}
            onPress={resetSettings}
          >
            <Ionicons name="refresh" size={18} color={iconColor} />
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>

        <RadioGroup
          title="Mode"
          options={gameModeOptions}
          selectedValue={settings.mode}
          onValueChange={(value) => updateSetting("mode", value)}
          row
        />

        <View style={[styles.separator, { backgroundColor: borderColor }]} />

        <RadioGroup
          title="Type"
          options={gameTypeOptions}
          selectedValue={settings.type}
          onValueChange={(value) => updateSetting("type", value)}
          row
        />

        <View style={[styles.separator, { backgroundColor: borderColor }]} />

        <RadioGroup
          title="Size Level"
          options={sizeOptions}
          selectedValue={settings.size}
          onValueChange={(value) => updateSetting("size", value)}
          row
        />

        <View style={[styles.separator, { backgroundColor: borderColor }]} />

        <View style={[styles.separator, { backgroundColor: borderColor }]} />

        <ColorSchemePicker
          title="Color Scheme"
          selectedValue={settings.colorScheme}
          onValueChange={(value) => updateSetting("colorScheme", value)}
        />

        <View style={[styles.separator, { backgroundColor: borderColor }]} />

        {settings.type === "letter" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Letters to Practice</Text>
            <Text style={styles.sectionDescription}>
              Select which letters you want to practice with
            </Text>
            <View style={styles.checkboxGrid}>
              {letters.map((letter) => (
                <Checkbox
                  key={letter}
                  label={letter}
                  value={letter}
                  checked={settings.toPractice.includes(letter)}
                  onToggle={handleLetterToggle}
                />
              ))}
            </View>
          </View>
        )}

        {settings.type === "number" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Numbers to Practice</Text>
            <Text style={styles.sectionDescription}>
              Select which numbers you want to practice with
            </Text>
            <View style={styles.checkboxGrid}>
              {numbers.map((number) => (
                <Checkbox
                  key={number}
                  label={number}
                  value={number}
                  checked={settings.toPractice.includes(number)}
                  onToggle={handleNumberToggle}
                />
              ))}
            </View>
          </View>
        )}

        <View style={styles.settingsPreview}>
          <Text style={styles.previewTitle}>Current Settings</Text>
          <View style={styles.previewContent}>
            <Text style={styles.previewText}>Mode: {settings.mode}</Text>
            <Text style={styles.previewText}>Type: {settings.type}</Text>
            <Text style={styles.previewText}>
              Size: {["1", "2", "3"][settings.size]}
            </Text>
            <Text style={styles.previewText}>
              Color Scheme:{" "}
              {COLOR_SCHEMES[settings.colorScheme]?.name || "Unknown"}
            </Text>
            <Text style={styles.previewText}>
              {settings.type === "letter"
                ? "Letters"
                : settings.type === "number"
                ? "Numbers"
                : "Items"}{" "}
              to Practice:{" "}
              {settings.toPractice.length > 0
                ? settings.toPractice.join(", ")
                : "None selected"}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    gap: 6,
  },
  resetText: {
    fontSize: 14,
    fontWeight: "500",
  },
  separator: {
    height: 1,
    marginVertical: 16,
    opacity: 0.3,
  },
  settingsPreview: {
    marginTop: 32,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "rgba(128, 128, 128, 0.1)",
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  previewContent: {
    gap: 6,
  },
  previewText: {
    fontSize: 14,
    opacity: 0.8,
  },
  section: {
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 16,
  },
  checkboxGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});
