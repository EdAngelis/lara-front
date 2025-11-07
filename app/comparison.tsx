import { useSettings } from "@/components/SettingsContext";
import { Text, View } from "@/components/Themed";
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
  const { settings } = useSettings();

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
    // Generate random indices for left and right items
    const newLeftIndex = Math.floor(Math.random() * items.length);
    let newRightIndex = Math.floor(Math.random() * items.length);

    // Ensure left and right items are different
    while (newRightIndex === newLeftIndex) {
      newRightIndex = Math.floor(Math.random() * items.length);
    }

    setLeftItemIndex(newLeftIndex);
    setRightItemIndex(newRightIndex);

    // Randomly choose which side is the target
    setTargetSide(Math.random() < 0.5 ? "left" : "right");
  }, [items.length]);

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
    const { translationX, velocityX } = event.nativeEvent;

    // Check if it's a right swipe (positive translationX and velocity)
    if (translationX > 100 && velocityX > 500) {
      router.push("/");
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <View style={styles.container}>
          {/* Left side - touchable area for left item */}
          <TouchableWithoutFeedback onPress={handleLeftTouch}>
            <View style={styles.leftSide}>
              <Text style={styles.letter}>{items[leftItemIndex]}</Text>
            </View>
          </TouchableWithoutFeedback>

          {/* Right side - touchable area for right item */}
          <TouchableWithoutFeedback onPress={handleRightTouch}>
            <View style={styles.rightSide}>
              <Text style={styles.letter}>{items[rightItemIndex]}</Text>
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
