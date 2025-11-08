import { StyleSheet } from "react-native";

import { NavigationButton } from "@/components/NavigationButton";
import { TabToggleButton } from "@/components/TabToggleButton";
import { useTabVisibility } from "@/components/TabVisibilityContext";
import { View } from "@/components/Themed";

export default function TabOneScreen() {
  const { isTabBarVisible } = useTabVisibility();

  return (
    <View style={styles.container}>
      <View style={styles.buttonGrid}>
        <NavigationButton
          icon="play-circle"
          path="/comparison"
          backgroundColor="#4CAF50"
        />
      </View>
      <TabToggleButton style={styles.floatingButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  buttonGrid: {
    flex: 1,
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
    gap: 8,
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
  },
});
