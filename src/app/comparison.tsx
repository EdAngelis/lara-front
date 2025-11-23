import { useSettings } from "@/components/SettingsContext";
import Shape from "@/components/shape";
import { View } from "@/components/Themed";
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
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";

const styles = StyleSheet.create({
  container: { flex: 1 },
  gridContainer: { flexDirection: "column" },
  row: { flex: 1, flexDirection: "row" },
  rowDivider: {},
  slot: { flex: 1, alignItems: "center", justifyContent: "center", padding: 8 },
  slotDivider: {},
  letter: { fontSize: 200, fontWeight: "bold", textAlign: "center" },
});

export default function ComparisonScreen() {
  const { settings, updateSetting } = useSettings();

  const allLetters = useMemo(() => "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""), []);
  const allNumbers = useMemo(() => "0123456789".split(""), []);
  const allShapes = useMemo(
    () => ["square", "circle", "triangle", "rectangle", "star"],
    []
  );

  const items = useMemo(() => {
    switch (settings.type) {
      case "letter":
        return allLetters;
      case "number":
        return allNumbers;
      case "shape":
      default:
        return allShapes;
    }
  }, [settings.type, allLetters, allNumbers, allShapes]);

  const fontSize = useMemo(() => {
    switch (settings.size) {
      case 0:
        return 320;
      case 1:
        return 280;
      case 2:
        return 240;
      case 3:
        return 200;
      case 4:
      default:
        return 160;
    }
  }, [settings.size]);

  const currentColorScheme = useMemo(
    () => COLOR_SCHEMES[settings.colorScheme] || COLOR_SCHEMES[0],
    [settings.colorScheme]
  );

  const [itemsIndices, setItemsIndices] = useState<number[]>([]);
  const [targetIndex, setTargetIndex] = useState<number>(0);
  const [touchCount, setTouchCount] = useState<number>(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  const [swipeProcessed, setSwipeProcessed] = useState<boolean>(false);

  // Animated refs per slot
  const scalesRef = useRef<Animated.Value[]>([]);
  const animRefs = useRef<(Animated.CompositeAnimation | null)[]>([]);

  // ensure scales length matches numberOfItems
  useEffect(() => {
    const count = settings.numberOfItems;
    if (scalesRef.current.length !== count) {
      scalesRef.current = Array.from(
        { length: count },
        () => new Animated.Value(1)
      );
      animRefs.current = Array.from({ length: count }, () => null);
    }
  }, [settings.numberOfItems]);

  const pickRandomIndexNotIn = useCallback(
    (used: Set<number>) => {
      let idx = Math.floor(Math.random() * items.length);
      while (used.has(idx) && used.size < items.length) {
        idx = Math.floor(Math.random() * items.length);
      }
      return idx;
    },
    [items.length]
  );

  const generateNewRound = useCallback(() => {
    const count = settings.numberOfItems;
    const newIndices = Array.from({ length: count }, () => -1);
    let newTargetIdx = 0;
    // If `onlySelected` is true and we have practice items, prefer them
    const practiceIndexes = (settings.toPractice || [])
      .map((p) =>
        items.findIndex(
          (it) => String(it).toLowerCase() === String(p).toLowerCase()
        )
      )
      .filter((idx) => idx !== -1);
    const uniquePractice = Array.from(new Set(practiceIndexes));

    if (settings.onlySelected && uniquePractice.length > 0) {
      // If we have enough practice items, pick from them only
      const used = new Set<number>();
      if (uniquePractice.length >= count) {
        // shuffle and take `count` items
        const shuffled = uniquePractice.sort(() => Math.random() - 0.5);
        for (let i = 0; i < count; i++) {
          newIndices[i] = shuffled[i];
          used.add(shuffled[i]);
        }
      } else {
        // place all practice items first at random slots, then fill remaining
        const slots = Array.from({ length: count }, (_, i) => i).sort(
          () => Math.random() - 0.5
        );
        let si = 0;
        for (const pi of uniquePractice) {
          const slot = slots[si++];
          newIndices[slot] = pi;
          used.add(pi);
        }
        for (let i = 0; i < count; i++) {
          if (newIndices[i] === -1) {
            const idx = pickRandomIndexNotIn(used);
            newIndices[i] = idx;
            used.add(idx);
          }
        }
      }
      newTargetIdx = Math.floor(Math.random() * count);
    } else if (settings.toPractice && settings.toPractice.length > 0) {
      // legacy behavior: try to place one practice item as the target
      const randomPractice =
        settings.toPractice[
          Math.floor(Math.random() * settings.toPractice.length)
        ];
      const practiceIndex = items.findIndex(
        (it) =>
          String(it).toLowerCase() === String(randomPractice).toLowerCase()
      );
      const practiceSlot = Math.floor(Math.random() * count);
      const used = new Set<number>();
      if (practiceIndex !== -1) {
        newIndices[practiceSlot] = practiceIndex;
        used.add(practiceIndex);
      } else {
        const idx = pickRandomIndexNotIn(used);
        newIndices[practiceSlot] = idx;
        used.add(idx);
      }
      for (let i = 0; i < count; i++) {
        if (newIndices[i] === -1) {
          const idx = pickRandomIndexNotIn(used);
          newIndices[i] = idx;
          used.add(idx);
        }
      }
      newTargetIdx = Math.floor(Math.random() * count);
    } else {
      const used = new Set<number>();
      for (let i = 0; i < count; i++) {
        const idx = pickRandomIndexNotIn(used);
        newIndices[i] = idx;
        used.add(idx);
      }
      newTargetIdx = Math.floor(Math.random() * count);
    }

    setItemsIndices(newIndices);
    setTargetIndex(newTargetIdx);

    // play prompt audio for the target if audio enabled
    const audioIndex = newIndices[newTargetIdx];
    let audioSource: any = null;
    if (settings.type === "shape") {
      audioSource =
        QUAL_A_FORMA.find((a) => a.reference === items[audioIndex])?.path ||
        null;
    } else if (settings.type === "letter") {
      audioSource = QUAL_A_LETRA[audioIndex]?.path || null;
    } else if (settings.type === "number") {
      audioSource = QUAL_O_NUMERO[audioIndex]?.path || null;
    }

    if (audioSource && (settings as any).audio) {
      (async () => {
        try {
          const { sound } = await Audio.Sound.createAsync(audioSource);
          await sound.playAsync();
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
  }, [
    items,
    pickRandomIndexNotIn,
    settings.numberOfItems,
    settings.toPractice,
    settings.type,
    (settings as any).audio,
  ]);

  useEffect(() => {
    generateNewRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startPulse = (index: number) => {
    const scale = scalesRef.current[index];
    if (!scale) return;
    if (animRefs.current[index]) {
      try {
        animRefs.current[index]?.stop();
      } catch (e) {}
    }
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.12,
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.96,
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    animRefs.current[index] = animation;
    animation.start();
  };

  const stopPulse = (index: number) => {
    const scale = scalesRef.current[index];
    if (!scale) return;
    const animation = animRefs.current[index];
    if (animation) {
      try {
        animation.stop();
      } catch (e) {}
      animRefs.current[index] = null;
    }
    Animated.timing(scale, {
      toValue: 1,
      duration: 120,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const handleSideTouch = async (index: number) => {
    if (isSwiping || isAudioPlaying) return;

    if (touchCount === 1) {
      setTouchCount(0);
      generateNewRound();
      return;
    }

    // second touch: register answer and advance
    setTouchCount(1);
    try {
      await answersService.createAnswer({
        numberOfItems: settings.numberOfItems,
        type: settings.type,
        item: items[itemsIndices[targetIndex]],
        result: index === targetIndex ? 0 : 1,
        size: settings.size,
        colors: [currentColorScheme.background, currentColorScheme.letters],
      });
    } catch (error) {
      console.error("Error saving answer:", error);
    }

    // play feedback audio if enabled
    let audioSource: any = null;
    if (index === targetIndex) {
      const r = Math.floor(
        Math.random() * CORRECT_ANSWERS_PHRASES_AUDIO.length
      );
      audioSource = CORRECT_ANSWERS_PHRASES_AUDIO[r]?.path || null;
    } else {
      const audioIndex = itemsIndices[index];
      if (settings.type === "shape")
        audioSource =
          ESTE_E_A_FORMA.find((a) => a.reference === items[audioIndex])?.path ||
          null;
      else if (settings.type === "letter")
        audioSource =
          ESTA_E_A_LETRA.find(
            (a) =>
              a.reference.toUpperCase() ===
              String(items[audioIndex]).toUpperCase()
          )?.path || null;
      else
        audioSource =
          ESTE_E_O_NUMERO.find(
            (a) =>
              a.reference.toUpperCase() ===
              String(items[audioIndex]).toUpperCase()
          )?.path || null;
    }

    if (audioSource && (settings as any).audio) {
      try {
        setIsAudioPlaying(true);
        const { sound } = await Audio.Sound.createAsync(audioSource);
        await sound.playAsync();
        sound.setOnPlaybackStatusUpdate((status: any) => {
          if (status.isLoaded && status.didJustFinish) {
            sound.unloadAsync();
            setIsAudioPlaying(false);
          }
        });
      } catch (error) {
        console.error("Error playing audio:", error);
        setIsAudioPlaying(false);
        generateNewRound();
      }
    } else {
      generateNewRound();
    }
  };

  const onGestureEvent = (event: any) => {
    const { translationX, velocityX, translationY, velocityY } =
      event.nativeEvent;
    if (Math.abs(translationX) > 10 || Math.abs(translationY) > 10)
      setIsSwiping(true);

    if (translationX > 100 && velocityX > 500 && !swipeProcessed) {
      setSwipeProcessed(true);
      const currentIndex = settings.colorScheme;
      const prevIndex =
        currentIndex - 1 < 0 ? COLOR_SCHEMES.length - 1 : currentIndex - 1;
      updateSetting("colorScheme", prevIndex as any);
    }

    if (translationX < -100 && velocityX < -500 && !swipeProcessed) {
      setSwipeProcessed(true);
      const currentIndex = settings.colorScheme;
      const nextIndex =
        currentIndex + 1 >= COLOR_SCHEMES.length ? 0 : currentIndex + 1;
      updateSetting("colorScheme", nextIndex as any);
    }

    if (translationY < -100 && velocityY < -500 && !swipeProcessed) {
      setSwipeProcessed(true);
      const currentSize = settings.size;
      if (currentSize > 0) updateSetting("size", (currentSize - 1) as any);
    }

    if (translationY > 100 && velocityY > 500 && !swipeProcessed) {
      setSwipeProcessed(true);
      const currentSize = settings.size;
      if (currentSize < 4) updateSetting("size", (currentSize + 1) as any);
    }
  };

  const onGestureEnd = () => {
    setSwipeProcessed(false);
    setTimeout(() => setIsSwiping(false), 100);
  };

  // Render helpers
  const renderSlot = (itemIdx: number, slotIdx: number) => {
    const content =
      settings.type === "shape" ? (
        <Shape
          shape={items[itemIdx] as any}
          color={currentColorScheme.letters}
          size={settings.size}
        />
      ) : (
        <Animated.Text
          style={[
            styles.letter,
            {
              color: currentColorScheme.letters,
              fontSize,
              transform: [{ scale: scalesRef.current[slotIdx] ?? 1 }],
            },
          ]}
        >
          {items[itemIdx]}
        </Animated.Text>
      );

    return (
      <TouchableWithoutFeedback
        key={slotIdx}
        onPress={() => handleSideTouch(slotIdx)}
        onPressIn={() => startPulse(slotIdx)}
        onPressOut={() => stopPulse(slotIdx)}
      >
        <Animated.View
          style={[
            styles.slot,
            slotIdx > 0 ? styles.slotDivider : null,
            {
              backgroundColor: currentColorScheme.background,
            },
          ]}
        >
          {content}
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onGestureEnd}
      >
        <View
          style={
            settings.numberOfItems === 4
              ? [styles.container, styles.gridContainer]
              : styles.container
          }
        >
          {settings.numberOfItems === 4 ? (
            (() => {
              const rows = [itemsIndices.slice(0, 2), itemsIndices.slice(2, 4)];
              return rows.map((rowItems, rIdx) => (
                <View
                  key={rIdx}
                  style={[styles.row, rIdx > 0 ? styles.rowDivider : null]}
                >
                  {rowItems.map((it, cIdx) => renderSlot(it, rIdx * 2 + cIdx))}
                </View>
              ));
            })()
          ) : (
            <View style={{ flex: 1, flexDirection: "row" }}>
              {itemsIndices.map((it, idx) => renderSlot(it, idx))}
            </View>
          )}
        </View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}
