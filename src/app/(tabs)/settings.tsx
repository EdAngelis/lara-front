import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, Switch, TouchableOpacity } from "react-native";

import { Checkbox } from "@/components/Checkbox";
import { ColorSchemePicker } from "@/components/ColorSchemePicker";
import { RadioGroup } from "@/components/RadioGroup";
import { GameType, Size, useSettings } from "@/components/SettingsContext";
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

  const gameTypeOptions = [
    {
      label: "Letras",
      value: "letter" as GameType,
      description: "Pratique com letras do alfabeto",
    },
    {
      label: "Números",
      value: "number" as GameType,
      description: "Pratique com valores numéricos",
    },
    {
      label: "Formas",
      value: "shape" as GameType,
      description: "Pratique com formas geométricas",
    },
  ];

  const sizeOptions = [
    {
      label: "Muito Fácil",
      value: 0 as Size,
      description: "Padrões simples e conceitos básicos",
    },
    {
      label: "Fácil",
      value: 1 as Size,
      description: "Padrões simples e conceitos básicos",
    },
    {
      label: "Médio",
      value: 2 as Size,
      description: "Desafios de complexidade moderada",
    },
    {
      label: "Difícil",
      value: 3 as Size,
      description: "Padrões e conceitos avançados",
    },
    {
      label: "Muito Difícil",
      value: 4 as Size,
      description: "Padrões e conceitos avançados",
    },
  ];

  const numberOfItemsOptions = [
    { label: "1 Item", value: 1 as 1 },
    { label: "2 Itens", value: 2 as 2 },
    { label: "3 Itens", value: 3 as 3 },
    { label: "4 Itens", value: 4 as 4 },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Configurações</Text>
          <TouchableOpacity
            style={[styles.resetButton, { borderColor }]}
            onPress={resetSettings}
          >
            <Ionicons name="refresh" size={18} color={iconColor} />
            <Text style={styles.resetText}>Resetar</Text>
          </TouchableOpacity>
        </View>

        {/* Mode selection removed */}

        <RadioGroup
          title="Tipo"
          options={gameTypeOptions}
          selectedValue={settings.type}
          onValueChange={(value) => updateSetting("type", value)}
          row
        />

        <View style={[styles.separator, { backgroundColor: borderColor }]} />

        <RadioGroup
          title="Nível de Tamanho"
          options={sizeOptions}
          selectedValue={settings.size}
          onValueChange={(value) => updateSetting("size", value)}
          row
        />

        <View style={[styles.separator, { backgroundColor: borderColor }]} />

        <RadioGroup
          title="Número de Itens"
          options={numberOfItemsOptions}
          selectedValue={(settings as any).numberOfItems}
          onValueChange={(value) =>
            updateSetting("numberOfItems", value as any)
          }
          row
        />

        <View style={[styles.separator, { backgroundColor: borderColor }]} />

        <View style={[styles.separator, { backgroundColor: borderColor }]} />

        <ColorSchemePicker
          title="Esquema de Cores"
          selectedValue={settings.colorScheme}
          onValueChange={(value) => updateSetting("colorScheme", value)}
        />

        <View style={[styles.separator, { backgroundColor: borderColor }]} />

        <View style={styles.toggleSection}>
          <View style={styles.toggleContent}>
            <Text style={styles.sectionTitle}>
              Praticar Apenas Selecionados
            </Text>
          </View>
          <Switch
            value={settings.onlySelected}
            onValueChange={(value) => updateSetting("onlySelected", value)}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={settings.onlySelected ? "#007AFF" : "#f4f3f4"}
          />
        </View>
        <View style={[styles.separator, { backgroundColor: borderColor }]} />

        <View style={styles.toggleSection}>
          <View style={styles.toggleContent}>
            <Text style={styles.sectionTitle}>Áudio</Text>
            <Text style={styles.sectionDescription}>
              Ativa ou desativa a reprodução de áudio durante o jogo
            </Text>
          </View>
          <Switch
            value={(settings as any).audio}
            onValueChange={(value) => updateSetting("audio", value as any)}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={(settings as any).audio ? "#007AFF" : "#f4f3f4"}
          />
        </View>
        {settings.type === "letter" && (
          <>
            <View
              style={[styles.separator, { backgroundColor: borderColor }]}
            />
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Letras para Praticar</Text>
              <Text style={styles.sectionDescription}>
                Selecione quais letras você quer praticar
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
          </>
        )}

        {settings.type === "number" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Números para Praticar</Text>
            <Text style={styles.sectionDescription}>
              Selecione quais números você quer praticar
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
          <Text style={styles.previewTitle}>Configurações Atuais</Text>
          <View style={styles.previewContent}>
            {/* Mode removed from settings */}
            <Text style={styles.previewText}>Tipo: {settings.type}</Text>
            <Text style={styles.previewText}>
              Tamanho: {["1", "2", "3"][settings.size]}
            </Text>
            <Text style={styles.previewText}>
              Esquema de Cores:{" "}
              {COLOR_SCHEMES[settings.colorScheme]?.name || "Desconhecido"}
            </Text>
            <Text style={styles.previewText}>
              Apenas Selecionados: {settings.onlySelected ? "Sim" : "Não"}
            </Text>
            <Text style={styles.previewText}>
              Áudio: {(settings as any).audio ? "Sim" : "Não"}
            </Text>
            <Text style={styles.previewText}>
              {settings.type === "letter"
                ? "Letras"
                : settings.type === "number"
                ? "Números"
                : "Itens"}{" "}
              para Praticar:{" "}
              {settings.toPractice.length > 0
                ? settings.toPractice.join(", ")
                : "Nenhum selecionado"}
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
  toggleSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
    gap: 16,
  },
  toggleContent: {
    flex: 1,
  },
});
