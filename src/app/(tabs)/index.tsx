import { StyleSheet } from "react-native";

import { NavigationButton } from "@/components/NavigationButton";
import { useSettings } from "@/components/SettingsContext";
import { TabToggleButton } from "@/components/TabToggleButton";
import { View } from "@/components/Themed";
import { useMemo } from "react";

export default function TabOneScreen() {
  const { settings } = useSettings();

  const gamePath = useMemo(() => {
    return "/comparison";
  }, [settings.numberOfItems]);

  return (
    <View style={styles.container}>
      <View style={styles.buttonGrid}>
        <NavigationButton
          //icon="play-circle"
          shape="square"
          qt={settings.numberOfItems}
          path={gamePath}
          backgroundColor="#0d0098ff"
        />
        {/* <NavigationButton
          path="/countShapes"
          backgroundColor="#ff5e00ff"
        /> */}
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
