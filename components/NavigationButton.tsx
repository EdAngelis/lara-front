import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, useThemeColor, View } from "./Themed";

interface NavigationButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  path: string;
  title?: string;
  backgroundColor?: string;
  style?: any;
}

export function NavigationButton({
  icon,
  path,
  title,
  backgroundColor: customBackgroundColor,
  style,
}: NavigationButtonProps) {
  const defaultBackgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");
  const borderColor = useThemeColor({}, "tabIconDefault");

  const buttonBackgroundColor =
    customBackgroundColor || defaultBackgroundColor + "90";

  const handlePress = () => {
    router.push(path as any);
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: buttonBackgroundColor,
          borderColor: borderColor + "40",
        },
        style,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={[styles.content, { backgroundColor: "transparent" }]}>
        <Ionicons name={icon} size={48} color={tintColor} style={styles.icon} />
        {title && (
          <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 140,
    minWidth: "45%",
    maxWidth: "48%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  icon: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
