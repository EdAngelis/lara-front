import { useSettings } from "@/components/SettingsContext";
import Shape from "@/components/shape";
import { Text, View } from "@/components/Themed";
import { CORRECT_ANSWERS_PHRASES_AUDIO } from "@/constants/audios-references/correct_answers_phrases.constants";
import { ESTA_E_A_LETRA } from "@/constants/audios-references/esta-e-a-letra.constant";
import { ESTE_E_A_FORMA } from "@/constants/audios-references/este-e-a-forma.constant";
import { ESTE_E_O_NUMERO } from "@/constants/audios-references/este-e-o-numero.constant";
import { QUAL_A_FORMA } from "@/constants/audios-references/qual-a-forma.constant";
import { QUAL_A_LETRA } from "@/constants/audios-references/qual-a-letra.constant";
import { QUAL_O_NUMERO } from "@/constants/audios-references/qual-o-numero.constant";
import { COLOR_SCHEMES } from "@/constants/ColorSchemes";
import { answersService } from "@/service/answers.service";
import { Audio } from "expo-av";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, TouchableWithoutFeedback } from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";

export default function ComparisonScreen() {
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
      // Array of numbers 0-9 as strings for display
      allItems = allNumbers;
    } else if (settings.type === "letter") {
      // Array of letters A-Z
      allItems = allLetters;
    } else if (settings.type === "shape") {
      allItems = allShapes;
    } else {
      // Default to letters if type is 'shape' or anything else
      allItems = allLetters;
    }

    // If onlySelected is true and there are items to practice, filter the array
    if (settings.onlySelected && settings.toPractice.length > 0) {
      return allItems.filter((item) => settings.toPractice.includes(item));
    }

    return allItems;
  }, [settings.type, settings.onlySelected, settings.toPractice]);

  // State to keep track of item indices for each slot (supports 2/3/4 items)
  const [itemsIndices, setItemsIndices] = useState<number[]>(
    Array.from({ length: (settings as any).numberOfItems || 2 }, (_, i) => i)
  );

  // Game state: which slot index (0..n-1) is the correct answer
  const [targetIndex, setTargetIndex] = useState<number>(0);

  // Track if swipe has been processed to prevent multiple triggers
  const [swipeProcessed, setSwipeProcessed] = useState(false);

  // Track if user is currently swiping to prevent touch events
  const [isSwiping, setIsSwiping] = useState(false);

  // Track if audio is currently playing
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  // Count touches to control when to advance rounds
  const [touchCount, setTouchCount] = useState(0);

  // Function to generate new round with random items and target side
  const generateNewRound = useCallback(() => {
    const count = (settings as any).numberOfItems || 2;
    const newIndices: number[] = new Array(count).fill(-1);
    let newTargetIdx = 0;
    let audioSource: any = null;

    const pickRandomIndexNotIn = (exclude: Set<number>) => {
      if (exclude.size >= items.length) return 0;
      let idx = Math.floor(Math.random() * items.length);
      while (exclude.has(idx)) {
        idx = Math.floor(Math.random() * items.length);
      }
      return idx;
    };

    // Check if toPractice array has elements
    if (settings.toPractice.length > 0) {
      // pick a practice item from toPractice
      const randomPracticeItem =
        settings.toPractice[
          Math.floor(Math.random() * settings.toPractice.length)
        ];
      const practiceItemIndex = items.findIndex(
        (it) => it === randomPracticeItem
      );

      // choose a random slot to put the practice item
      const practiceSlot = Math.floor(Math.random() * count);

      const used = new Set<number>();
      if (practiceItemIndex !== -1) {
        newIndices[practiceSlot] = practiceItemIndex;
        used.add(practiceItemIndex);
      } else {
        // fallback: pick a random index for practice slot
        const idx = pickRandomIndexNotIn(used);
        newIndices[practiceSlot] = idx;
        used.add(idx);
      }

      // fill other slots with unique random indices
      for (let i = 0; i < count; i++) {
        if (newIndices[i] === -1) {
          const idx = pickRandomIndexNotIn(used);
          newIndices[i] = idx;
          used.add(idx);
        }
      }

      newTargetIdx = practiceSlot;

      const audioIndex = newIndices[newTargetIdx];
      audioSource =
        settings.type === "shape"
          ? QUAL_A_FORMA.find((audio) => audio.reference === items[audioIndex])
              ?.path || null
          : settings.type === "letter"
          ? QUAL_A_LETRA.find(
              (audio) => audio.reference.toUpperCase() === items[audioIndex]
            )?.path || ""
          : QUAL_O_NUMERO.find(
              (audio) => audio.reference.toUpperCase() === items[audioIndex]
            )?.path || "";
    } else {
      // No toPractice: pick unique random indices for all slots
      const used = new Set<number>();
      for (let i = 0; i < count; i++) {
        const idx = pickRandomIndexNotIn(used);
        newIndices[i] = idx;
        used.add(idx);
      }
      newTargetIdx = Math.floor(Math.random() * count);
      const audioIndex = newIndices[newTargetIdx];
      audioSource =
        settings.type === "shape"
          ? QUAL_A_FORMA.find((audio) => audio.reference === items[audioIndex])
              ?.path || null
          : settings.type === "letter"
          ? QUAL_A_LETRA[audioIndex].path || ""
          : QUAL_O_NUMERO[audioIndex].path || "";
    }

    setItemsIndices(newIndices);
    setTargetIndex(newTargetIdx);

    // Play audio using audioSource only if audio setting enabled
    if (audioSource && (settings as any).audio) {
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
  }, [items.length, items, settings.toPractice]);

  // Initialize first round when component mounts only
  useEffect(() => {
    generateNewRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Game functions - check if user touched a slot (index)
  const handleSideTouch = async (index: number) => {
    // Ignore touch if user is swiping or audio is playing
    if (isSwiping || isAudioPlaying) {
      return;
    }

    // increment touch count on every touch (first touch registers, second advances)
    if (touchCount === 0) {
      setTouchCount(1);
    } else {
      setTouchCount(0);
      generateNewRound();
      return;
    }

    try {
      const resp = await answersService.createAnswer({
        numberOfItems: settings.numberOfItems,
        type: settings.type,
        item: items[itemsIndices[targetIndex]],
        result: index === targetIndex ? 0 : 1,
        size: settings.size,
        colors: [currentColorScheme.background, currentColorScheme.letters],
      });
      console.log("Answer recorded:", resp);
    } catch (error) {
      console.error("Error in handleSideTouch:", error);
    }

    let audioSource;
    if (index === targetIndex) {
      const randomIndex = Math.floor(
        Math.random() * CORRECT_ANSWERS_PHRASES_AUDIO.length
      );

      audioSource =
        settings.type === "shape"
          ? CORRECT_ANSWERS_PHRASES_AUDIO[randomIndex].path || ""
          : CORRECT_ANSWERS_PHRASES_AUDIO[randomIndex].path || "";
    } else {
      const audioIndex = itemsIndices[index];
      audioSource =
        settings.type === "shape"
          ? ESTE_E_A_FORMA.find(
              (audio) => audio.reference === items[audioIndex]
            )?.path || null
          : settings.type === "letter"
          ? ESTA_E_A_LETRA.find(
              (audio) => audio.reference.toUpperCase() === items[audioIndex]
            )?.path || ""
          : ESTE_E_O_NUMERO.find(
              (audio) => audio.reference.toUpperCase() === items[audioIndex]
            )?.path || "";
    }

    if (audioSource && (settings as any).audio) {
      (async () => {
        try {
          setIsAudioPlaying(true);
          const { sound } = await Audio.Sound.createAsync(audioSource);
          await sound.playAsync();
          // Single callback to handle both unload and next round (advance only when touched)
          sound.setOnPlaybackStatusUpdate((status: any) => {
            if (status.isLoaded && status.didJustFinish) {
              sound.unloadAsync();
              setIsAudioPlaying(false);
            }
          });
        } catch (error) {
          console.error("Error playing audio:", error);
          setIsAudioPlaying(false);
          // fallback: advance only if touched
          setTouchCount((prev) => {
            if (prev > 0) {
              generateNewRound();
              return 0;
            }
            return prev;
          });
        }
      })();
    } else {
      // If there's no audio or audio setting is disabled, advance only when touched
      setTouchCount((prev) => {
        if (prev > 0) {
          generateNewRound();
          return 0;
        }
        return prev;
      });
    }
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
      // Move to previous color scheme (wrap around)
      const currentIndex = settings.colorScheme;
      const prevIndex =
        currentIndex - 1 < 0 ? COLOR_SCHEMES.length - 1 : currentIndex - 1;
      updateSetting("colorScheme", prevIndex as any);
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
        <View
          style={
            (settings as any).numberOfItems === 4
              ? [styles.container, styles.gridContainer]
              : styles.container
          }
        >
          {(settings as any).numberOfItems === 4
            ? // Render a 2x2 grid: two rows with two slots each
              (() => {
                const rows: number[][] = [
                  itemsIndices.slice(0, 2),
                  itemsIndices.slice(2, 4),
                ];
                return rows.map((rowItems, rowIdx) => (
                  <View
                    key={rowIdx}
                    style={[styles.row, rowIdx > 0 ? styles.rowDivider : null]}
                  >
                    {rowItems.map((itemIdx, colIdx) => {
                      const globalIndex = rowIdx * 2 + colIdx;
                      return (
                        <TouchableWithoutFeedback
                          key={globalIndex}
                          onPress={() => handleSideTouch(globalIndex)}
                        >
                          <View
                            style={[
                              styles.slot,
                              colIdx > 0 ? styles.slotDivider : null,
                              {
                                backgroundColor: currentColorScheme.background,
                              },
                            ]}
                          >
                            {settings.type === "shape" ? (
                              <Shape
                                shape={
                                  items[itemIdx] as
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
                                  styles.letter,
                                  {
                                    color: currentColorScheme.letters,
                                    fontSize,
                                  },
                                ]}
                              >
                                {items[itemIdx]}
                              </Text>
                            )}
                          </View>
                        </TouchableWithoutFeedback>
                      );
                    })}
                  </View>
                ));
              })()
            : // Fallback: single row layout for 1/2/3 items
              itemsIndices.map((itemIdx, i) => (
                <TouchableWithoutFeedback
                  key={i}
                  onPress={() => handleSideTouch(i)}
                >
                  <View
                    style={[
                      styles.slot,
                      i > 0 ? styles.slotDivider : null,
                      { backgroundColor: currentColorScheme.background },
                    ]}
                  >
                    {settings.type === "shape" ? (
                      <Shape
                        shape={
                          items[itemIdx] as
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
                          styles.letter,
                          { color: currentColorScheme.letters, fontSize },
                        ]}
                      >
                        {items[itemIdx]}
                      </Text>
                    )}
                  </View>
                </TouchableWithoutFeedback>
              ))}
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
  slot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  slotDivider: {
    borderLeftWidth: 2,
    borderLeftColor: "rgba(255, 255, 255, 0.2)",
  },
  gridContainer: {
    flexDirection: "column",
  },
  row: {
    flex: 1,
    flexDirection: "row",
  },
  rowDivider: {
    borderTopWidth: 2,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },
});
