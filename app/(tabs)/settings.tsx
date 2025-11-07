import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

import { ColorSchemePicker } from "@/components/ColorSchemePicker";
import { RadioGroup } from "@/components/RadioGroup";
import {
  Difficulty,
  GameMode,
  GameType,
  useSettings,
} from "@/components/SettingsContext";
import { Text, useThemeColor, View } from "@/components/Themed";
import { ToggleSwitch } from "@/components/ToggleSwitch";

export default function SettingsScreen() {
  const { settings, updateSetting, resetSettings } = useSettings();
  const iconColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({}, "tabIconDefault");

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

  const difficultyOptions = [
    {
      label: "Easy",
      value: 0 as Difficulty,
      description: "Simple patterns and basic concepts",
    },
    {
      label: "Medium",
      value: 1 as Difficulty,
      description: "Moderate complexity challenges",
    },
    {
      label: "Hard",
      value: 2 as Difficulty,
      description: "Advanced patterns and concepts",
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Game Settings</Text>
          <TouchableOpacity
            style={[styles.resetButton, { borderColor }]}
            onPress={resetSettings}
          >
            <Ionicons name="refresh" size={18} color={iconColor} />
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>

        <RadioGroup
          title="Game Mode"
          options={gameModeOptions}
          selectedValue={settings.mode}
          onValueChange={(value) => updateSetting("mode", value)}
          row
        />

        <View style={[styles.separator, { backgroundColor: borderColor }]} />

        <RadioGroup
          title="Game Type"
          options={gameTypeOptions}
          selectedValue={settings.type}
          onValueChange={(value) => updateSetting("type", value)}
          row
        />

        <View style={[styles.separator, { backgroundColor: borderColor }]} />

        <RadioGroup
          title="Difficulty Level"
          options={difficultyOptions}
          selectedValue={settings.difficulty}
          onValueChange={(value) => updateSetting("difficulty", value)}
          row
        />

        <View style={[styles.separator, { backgroundColor: borderColor }]} />

        <ToggleSwitch
          title="Random Mode"
          description="Randomize question order and patterns"
          value={settings.random}
          onValueChange={(value) => updateSetting("random", value)}
        />

        <View style={[styles.separator, { backgroundColor: borderColor }]} />

        <ColorSchemePicker
          title="Color Scheme"
          selectedValue={settings.colorScheme}
          onValueChange={(value) => updateSetting("colorScheme", value)}
        />

        <View style={styles.settingsPreview}>
          <Text style={styles.previewTitle}>Current Settings</Text>
          <View style={styles.previewContent}>
            <Text style={styles.previewText}>Mode: {settings.mode}</Text>
            <Text style={styles.previewText}>Type: {settings.type}</Text>
            <Text style={styles.previewText}>
              Difficulty: {["Easy", "Medium", "Hard"][settings.difficulty]}
            </Text>
            <Text style={styles.previewText}>
              Random: {settings.random ? "Enabled" : "Disabled"}
            </Text>
            <Text style={styles.previewText}>
              Color Scheme: {settings.colorScheme}
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
});
