import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import React, { useEffect } from "react";

import {
  TabVisibilityProvider,
  useTabVisibility,
} from "@/components/TabVisibilityContext";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

function TabsContent() {
  const colorScheme = useColorScheme();
  const { isTabBarVisible } = useTabVisibility();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        tabBarStyle: isTabBarVisible
          ? {
              backgroundColor: Colors[colorScheme ?? "light"].background,
              borderTopColor: Colors[colorScheme ?? "light"].tabIconDefault,
            }
          : { display: "none" }, // Dynamic tab bar visibility
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Config",
          tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
        }}
      />
      <Tabs.Screen
        name="DashboardPage"
        options={{
          title: "Desempenho",
          tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  useEffect(() => {
    (async () => {
      try {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("Could not lock screen orientation for tabs:", e);
      }
    })();
    return () => {
      // Optionally unlock on unmount to restore default behavior
      (async () => {
        try {
          await ScreenOrientation.unlockAsync();
        } catch (e) {
          // ignore
        }
      })();
    };
  }, []);
  return (
    <TabVisibilityProvider>
      <TabsContent />
    </TabVisibilityProvider>
  );
}
