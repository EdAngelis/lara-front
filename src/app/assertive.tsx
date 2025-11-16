import { useSettings } from "@/components/SettingsContext";
import Shape from "@/components/shape";
import { Text, View } from "@/components/Themed";
import { COLOR_SCHEMES } from "@/constants/ColorSchemes";
import { answersService } from "@/service/answers.service";
import { Audio } from "expo-av";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, TouchableWithoutFeedback } from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";

export default function AssertiveScreen() {
  // Get settings from context
  const { settings, updateSetting } = useSettings();

  const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const allNumbers = "0123456789".split("");
  const allShapes = ["square", "circle", "triangle", "rectangle", "star"];

  // Get current color scheme based on settings
  const currentColorScheme = useMemo(() => {
    return COLOR_SCHEMES[settings.colorScheme] || COLOR_SCHEMES[0];
  }, [settings.colorScheme]);

  // Get font size based on size setting
  const fontSize = useMemo(() => {
    switch (settings.size) {
      case 0: // Easy
        return 320;
      case 1: // Medium
        return 280;
      case 2: // Hard
        return 240;
      case 3: // Very Hard
        return 200;
      case 4: // Extremely Hard
        return 160;
      default:
        return 160;
    }
  }, [settings.size]);

  // Create arrays based on type setting
  const items = useMemo(() => {
    let allItems: string[] = [];

    if (settings.type === "number") {
      allItems = allNumbers;
    } else if (settings.type === "letter") {
      allItems = allLetters;
    } else if (settings.type === "shape") {
      allItems = allShapes;
    } else {
      allItems = allLetters;
    }

    // If onlySelected is true and there are items to practice, filter the array
    if (settings.onlySelected && settings.toPractice.length > 0) {
      return allItems.filter((item) => settings.toPractice.includes(item));
    }

    return allItems;
  }, [settings.type, settings.onlySelected, settings.toPractice]);

  // State to keep track of current item index
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  // Track if swipe has been processed to prevent multiple triggers
  const [swipeProcessed, setSwipeProcessed] = useState(false);

  // Track if user is currently swiping to prevent touch events
  const [isSwiping, setIsSwiping] = useState(false);

  // Track if audio is currently playing
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Function to generate new item
  const generateNewItem = useCallback(() => {
    let newItemIndex: number;
    let audioSource;

    // Check if toPractice array has elements
    if (settings.toPractice.length > 0) {
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
        newItemIndex = practiceItemIndex;
      } else {
        // Fallback: if practice item not found, use random generation
        newItemIndex = Math.floor(Math.random() * items.length);
      }
    } else {
      // toPractice is empty, use random generation
      newItemIndex = Math.floor(Math.random() * items.length);
    }

    // Set audio source based on game type
    if (settings.type === "shape") {
      audioSource = require("@/assets/audio/questions/que-forma-e-esta.mp3");
    } else if (settings.type === "letter") {
      audioSource = require("@/assets/audio/questions/que-letra-e-esta.mp3");
    } else {
      audioSource = require("@/assets/audio/questions/que-numero-e-este.mp3");
    }

    setCurrentItemIndex(newItemIndex);

    // Play audio using audioSource
    if (audioSource) {
      (async () => {
        try {
          const { sound } = await Audio.Sound.createAsync(audioSource);
          await sound.playAsync();
          // Unload sound after playing to free up resources
          sound.setOnPlaybackStatusUpdate((status: any) => {
            if (status.isLoaded && status.didJustFinish) {
              sound.unloadAsync();
            }
          });
        } catch (error) {
          console.error("Error playing audio:", error);
        }
      })();
    }
  }, [items.length, items, settings.toPractice, settings.type]);

  // Initialize first item when component mounts
  useEffect(() => {
    generateNewItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle screen touch - just advance to next item
  const handleScreenTouch = async () => {
    // Ignore touch if user is swiping or audio is playing
    if (isSwiping || isAudioPlaying) {
      return;
    }

    try {
      await answersService.createAnswer({
        mode: settings.mode,
        type: settings.type,
        item: items[currentItemIndex],
        result: 0, // No right/wrong in assertive mode
        size: settings.size,
        colors: [currentColorScheme.background, currentColorScheme.letters],
      });
    } catch (error) {
      console.error("Error in handleScreenTouch:", error);
    }

    setIsAudioPlaying(true);
    // Small delay before generating new item to prevent rapid tapping
    setTimeout(() => {
      generateNewItem();
      setIsAudioPlaying(false);
    }, 300);
  };

  // Gesture handler for swipe to navigate
  const onGestureEvent = (event: any) => {
    const { translationX, velocityX, translationY, velocityY } =
      event.nativeEvent;

    // Mark as swiping if movement is detected
    if (Math.abs(translationX) > 10 || Math.abs(translationY) > 10) {
      setIsSwiping(true);
    }

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
    // Reset swiping state after a small delay to allow touch to be properly ignored
    setTimeout(() => {
      setIsSwiping(false);
    }, 100);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onGestureEnd}
      >
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={handleScreenTouch}>
            <View
              style={[
                styles.content,
                { backgroundColor: currentColorScheme.background },
              ]}
            >
              {settings.type === "shape" ? (
                <Shape
                  shape={
                    items[currentItemIndex] as
                      | "square"
                      | "circle"
                      | "triangle"
                      | "rectangle"
                      | "star"
                  }
                  color={currentColorScheme.letters}
                  size={settings.size}
                />
              ) : (
                <Text
                  style={[
                    styles.item,
                    { color: currentColorScheme.letters, fontSize },
                  ]}
                >
                  {items[currentItemIndex]}
                </Text>
              )}
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
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    fontSize: 200,
    fontWeight: "bold",
    textAlign: "center",
  },
});
