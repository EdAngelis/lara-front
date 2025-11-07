import { useSettings } from "@/components/SettingsContext";
import { Text, View } from "@/components/Themed";
import { COLOR_SCHEMES } from "@/constants/ColorSchemes";
import { router } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, StyleSheet, TouchableWithoutFeedback } from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";

export default function ComparisonScreen() {
  // Get settings from context
  const { settings, updateSetting } = useSettings();

  // Get current color scheme based on settings
  const currentColorScheme = useMemo(() => {
    return COLOR_SCHEMES[settings.colorScheme] || COLOR_SCHEMES[0];
  }, [settings.colorScheme]);

  // Get font size based on size setting
  const fontSize = useMemo(() => {
    switch (settings.size) {
      case 0: // Easy
        return 240;
      case 1: // Medium
        return 200;
      case 2: // Hard
        return 160;
      case 3: // Very Hard
        return 120;
      case 4: // Extremely Hard
        return 100;
      default:
        return 160;
    }
  }, [settings.size]);

  // Create arrays based on type setting
  const items = useMemo(() => {
    if (settings.type === "number") {
      // Array of numbers 0-9 as strings for display
      return Array.from({ length: 10 }, (_, i) => i.toString());
    } else if (settings.type === "letter") {
      // Array of letters A-Z
      return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    } else {
      // Default to letters if type is 'shape' or anything else
      return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    }
  }, [settings.type]);

  // State to keep track of left and right item indices
  const [leftItemIndex, setLeftItemIndex] = useState(0);
  const [rightItemIndex, setRightItemIndex] = useState(1);

  // Game state: which side is the correct answer ('left' or 'right')
  const [targetSide, setTargetSide] = useState<"left" | "right">("left");

  // Track if swipe has been processed to prevent multiple triggers
  const [swipeProcessed, setSwipeProcessed] = useState(false);

  // Force landscape orientation when component mounts
  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    };

    lockOrientation();

    // Cleanup: unlock orientation when component unmounts
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  // Function to generate new round with random items and target side
  const generateNewRound = useCallback(() => {
    let newLeftIndex: number;
    let newRightIndex: number;
    let newTargetSide: "left" | "right";

    // Check if toPractice array has elements
    if (settings.toPractice.length > 0) {
      // Randomly choose one side to place the practice item
      const practiceOnLeft = Math.random() < 0.5;

      // Get a random item from toPractice array
      const randomPracticeItem =
        settings.toPractice[
          Math.floor(Math.random() * settings.toPractice.length)
        ];

      // Find the index of this practice item in the items array
      const practiceItemIndex = items.findIndex(
        (item) => item === randomPracticeItem
      );

      if (practiceItemIndex !== -1) {
        // Place practice item on chosen side
        if (practiceOnLeft) {
          newLeftIndex = practiceItemIndex;
          // Generate random index for right side, ensuring it's different
          newRightIndex = Math.floor(Math.random() * items.length);
          while (newRightIndex === newLeftIndex) {
            newRightIndex = Math.floor(Math.random() * items.length);
          }
          // Set target side to left since that's where the practice item is
          newTargetSide = "left";
        } else {
          newRightIndex = practiceItemIndex;
          // Generate random index for left side, ensuring it's different
          newLeftIndex = Math.floor(Math.random() * items.length);
          while (newLeftIndex === newRightIndex) {
            newLeftIndex = Math.floor(Math.random() * items.length);
          }
          // Set target side to right since that's where the practice item is
          newTargetSide = "right";
        }
      } else {
        // Fallback: if practice item not found in items array, use random generation
        newLeftIndex = Math.floor(Math.random() * items.length);
        newRightIndex = Math.floor(Math.random() * items.length);
        while (newRightIndex === newLeftIndex) {
          newRightIndex = Math.floor(Math.random() * items.length);
        }
        // Use random target side for fallback
        newTargetSide = Math.random() < 0.5 ? "left" : "right";
      }
    } else {
      // toPractice is empty, use original random generation logic
      newLeftIndex = Math.floor(Math.random() * items.length);
      newRightIndex = Math.floor(Math.random() * items.length);

      // Ensure left and right items are different
      while (newRightIndex === newLeftIndex) {
        newRightIndex = Math.floor(Math.random() * items.length);
      }

      // Use random target side when no practice items
      newTargetSide = Math.random() < 0.5 ? "left" : "right";
    }

    setLeftItemIndex(newLeftIndex);
    setRightItemIndex(newRightIndex);
    setTargetSide(newTargetSide);
  }, [items.length, items, settings.toPractice]);

  // Initialize first round when component mounts or items change
  useEffect(() => {
    generateNewRound();
  }, [generateNewRound]);

  // Game functions - check if user touched correct side
  const handleLeftTouch = () => {
    if (targetSide === "left") {
      // Correct choice
      Alert.alert("🎉 Correct!", "Great job! You chose the right side.", [
        { text: "Next Round", onPress: generateNewRound },
      ]);
    } else {
      // Wrong choice
      Alert.alert("❌ Wrong!", "Oops! Try the other side next time.", [
        { text: "Try Again", onPress: generateNewRound },
      ]);
    }
  };

  const handleRightTouch = () => {
    if (targetSide === "right") {
      // Correct choice
      Alert.alert("🎉 Correct!", "Great job! You chose the right side.", [
        { text: "Next Round", onPress: generateNewRound },
      ]);
    } else {
      // Wrong choice
      Alert.alert("❌ Wrong!", "Oops! Try the other side next time.", [
        { text: "Try Again", onPress: generateNewRound },
      ]);
    }
  };

  // Gesture handler for swipe to navigate
  const onGestureEvent = (event: any) => {
    const { translationX, velocityX, translationY, velocityY } =
      event.nativeEvent;

    // Check if it's a right swipe (positive translationX and velocity) and not processed yet
    if (translationX > 100 && velocityX > 500 && !swipeProcessed) {
      setSwipeProcessed(true);
      router.push("/");
    }

    // Check if it's a left swipe (negative translationX and velocity) and not processed yet
    if (translationX < -100 && velocityX < -500 && !swipeProcessed) {
      setSwipeProcessed(true);
      const currentIndex = settings.colorScheme;
      const nextIndex =
        currentIndex + 1 >= COLOR_SCHEMES.length ? 0 : currentIndex + 1;
      updateSetting("colorScheme", nextIndex);
    }

    // Check if it's an upward swipe (negative translationY and velocity) and not processed yet
    if (translationY < -100 && velocityY < -500 && !swipeProcessed) {
      setSwipeProcessed(true);
      const currentSize = settings.size;
      if (currentSize > 0) {
        updateSetting("size", (currentSize - 1) as any);
      }
    }

    // Check if it's a downward swipe (positive translationY and velocity) and not processed yet
    if (translationY > 100 && velocityY > 500 && !swipeProcessed) {
      setSwipeProcessed(true);
      const currentSize = settings.size;
      if (currentSize < 4) {
        updateSetting("size", (currentSize + 1) as any);
      }
    }
  };

  // Reset swipe processed flag when gesture ends
  const onGestureEnd = () => {
    setSwipeProcessed(false);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onGestureEnd}
      >
        <View style={styles.container}>
          {/* Left side - touchable area for left item */}
          <TouchableWithoutFeedback onPress={handleLeftTouch}>
            <View
              style={[
                styles.leftSide,
                { backgroundColor: currentColorScheme.background },
              ]}
            >
              <Text
                style={[
                  styles.letter,
                  { color: currentColorScheme.letters, fontSize },
                ]}
              >
                {items[leftItemIndex]}
              </Text>
            </View>
          </TouchableWithoutFeedback>

          {/* Right side - touchable area for right item */}
          <TouchableWithoutFeedback onPress={handleRightTouch}>
            <View
              style={[
                styles.rightSide,
                { backgroundColor: currentColorScheme.background },
              ]}
            >
              <Text
                style={[
                  styles.letter,
                  { color: currentColorScheme.letters, fontSize },
                ]}
              >
                {items[rightItemIndex]}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  leftSide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 2,
    borderRightColor: "rgba(255, 255, 255, 0.3)",
  },
  rightSide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  letter: {
    fontSize: 200,
    fontWeight: "bold",
    textAlign: "center",
  },
});
