import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { SettingsProvider } from "@/components/SettingsContext";
import { useColorScheme } from "@/components/useColorScheme";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // lock the app to landscape at runtime — works in Expo Go and dev clients
    (async () => {
      try {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
      } catch (e) {
        // non-fatal: log it so we can diagnose on devices that reject the lock
        // eslint-disable-next-line no-console
        console.warn("Could not lock screen orientation:", e);
      }
    })();
  }, []);

  return (
    <SettingsProvider>
      <ThemeProvider value={DarkTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
          <Stack.Screen
            name="comparison"
            options={{
              headerShown: false,
              orientation: "landscape",
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="assertive"
            options={{
              headerShown: false,
              orientation: "landscape",
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="countShapes"
            options={{
              headerShown: false,
              orientation: "landscape",
              animation: "slide_from_right",
            }}
          />
        </Stack>
      </ThemeProvider>
    </SettingsProvider>
  );
}
