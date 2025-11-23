import { useSettings } from "@/components/SettingsContext";
import { COLOR_SCHEMES } from "@/constants/ColorSchemes";
import { Audio } from "expo-av";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
  TapGestureHandler,
} from "react-native-gesture-handler";

export default function CountShapes() {
  const { settings, updateSetting } = useSettings();
  const { width, height } = useWindowDimensions();

  const count = settings.numberOfCircles || 1;

  const colorScheme = useMemo(
    () => COLOR_SCHEMES[settings.colorScheme] || COLOR_SCHEMES[0],
    [settings.colorScheme]
  );
  const circleColor = colorScheme.letters || "#FF6B6B";

  // map settings.size to pixel size (larger index -> larger circle)
  const circleSize = useMemo(() => {
    switch (settings.size) {
      case 0:
        return 40;
      case 1:
        return 50;
      case 2:
        return 60;
      case 3:
        return 70;
      case 4:
      default:
        return 80;
    }
  }, [settings.size]);

  const [positions, setPositions] = useState<
    { left: number; top: number; id: number }[]
  >([]);

  // animated scale refs per circle
  const scalesRef = useRef<Animated.Value[]>([]);
  const animRefs = useRef<(Animated.CompositeAnimation | null)[]>([]);

  // ensure scales length matches count
  useEffect(() => {
    if (scalesRef.current.length !== count) {
      scalesRef.current = Array.from(
        { length: count },
        () => new Animated.Value(1)
      );
      animRefs.current = Array.from({ length: count }, () => null);
    }
  }, [count]);

  const soundRef = useRef<any>(null);

  // load pop sound once
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        const { sound } = await Audio.Sound.createAsync(
          // asset path relative to this file
          require("../../assets/cartoon-jump.mp3"),
          { shouldPlay: false }
        );
        if (mounted) soundRef.current = sound;
      } catch (e) {
        console.warn("Failed to load cartoon-jump sound", e);
      }
    };
    load();
    return () => {
      mounted = false;
      if (soundRef.current) {
        try {
          soundRef.current.unloadAsync();
        } catch (e) {
          /* ignore */
        }
      }
    };
  }, []);

  const generatePositions = (
    count: number,
    width: number,
    height: number,
    size: number,
    padding = 8
  ) => {
    if (width <= 0 || height <= 0)
      return [] as { left: number; top: number; id: number }[];

    const availableWidth = Math.max(0, width - size - padding * 2);
    const availableHeight = Math.max(0, height - size - padding * 2);

    const centersDistance = (x1: number, y1: number, x2: number, y2: number) =>
      Math.hypot(x1 - x2, y1 - y2);

    const isOverlapping = (
      left: number,
      top: number,
      others: { left: number; top: number; id: number }[],
      diameter: number
    ) => {
      const cx = left + diameter / 2;
      const cy = top + diameter / 2;
      for (const o of others) {
        const ocx = o.left + diameter / 2;
        const ocy = o.top + diameter / 2;
        if (centersDistance(cx, cy, ocx, ocy) < diameter) return true;
      }
      return false;
    };

    const newPos: { left: number; top: number; id: number }[] = [];
    const maxAttempts = 200;
    for (let i = 0; i < count; i++) {
      let attempts = 0;
      let placed = false;
      let candidateLeft = padding;
      let candidateTop = padding;
      while (attempts < maxAttempts && !placed) {
        candidateLeft =
          padding + Math.floor(Math.random() * (availableWidth + 1));
        candidateTop =
          padding + Math.floor(Math.random() * (availableHeight + 1));
        if (!isOverlapping(candidateLeft, candidateTop, newPos, size)) {
          placed = true;
          break;
        }
        attempts++;
      }
      newPos.push({ left: candidateLeft, top: candidateTop, id: i });
    }

    return newPos;
  };

  const handleRemove = async (id: number) => {
    try {
      if (soundRef.current) {
        try {
          await soundRef.current.setPositionAsync(0);
          await soundRef.current.playAsync();
        } catch (e) {
          // fallback: try replay
          try {
            await soundRef.current.replayAsync();
          } catch (err) {
            // ignore
          }
        }
      }
    } catch (e) {
      console.warn("Error playing pop sound", e);
    }

    setPositions((prev) => prev.filter((p) => p.id !== id));
  };

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
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.96,
          duration: 300,
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
      useNativeDriver: true,
    }).start();
  };

  const startPulseAll = () => {
    for (let i = 0; i < scalesRef.current.length; i++) startPulse(i);
  };

  const stopPulseAll = () => {
    for (let i = 0; i < scalesRef.current.length; i++) stopPulse(i);
  };

  useEffect(() => {
    // Generate positions only when count or layout changes (not on size change)
    const newPos = generatePositions(count, width, height, circleSize, 8);
    setPositions(newPos);
  }, [count, width, height]);

  // When circleSize (or layout) changes, clamp existing positions so circles remain fully on-screen
  useEffect(() => {
    if (!positions || positions.length === 0) return;
    const padding = 8;
    const size = circleSize;
    if (width <= 0 || height <= 0) return;

    const maxLeft = Math.max(padding, width - size - padding);
    const maxTop = Math.max(padding, height - size - padding);

    // first clamp positions to bounds
    let clamped = positions.map((p) => ({
      ...p,
      left: Math.min(Math.max(p.left, padding), maxLeft),
      top: Math.min(Math.max(p.top, padding), maxTop),
    }));

    // then try to resolve overlaps by attempting small repositions for overlapping circles
    const centersDistance = (x1: number, y1: number, x2: number, y2: number) =>
      Math.hypot(x1 - x2, y1 - y2);

    const diameter = size;
    const tries = 100;
    for (let i = 0; i < clamped.length; i++) {
      let attempts = 0;
      const cx = () => clamped[i].left + diameter / 2;
      const cy = () => clamped[i].top + diameter / 2;
      const hasOverlap = () => {
        for (let j = 0; j < clamped.length; j++) {
          if (i === j) continue;
          const ocx = clamped[j].left + diameter / 2;
          const ocy = clamped[j].top + diameter / 2;
          if (centersDistance(cx(), cy(), ocx, ocy) < diameter) return true;
        }
        return false;
      };

      while (attempts < tries && hasOverlap()) {
        // try to nudge to a nearby non-overlapping place within bounds
        const delta = Math.max(8, Math.floor(diameter / 3));
        const candidateLeft = Math.min(
          maxLeft,
          Math.max(
            padding,
            clamped[i].left +
              (Math.floor(Math.random() * (delta * 2 + 1)) - delta)
          )
        );
        const candidateTop = Math.min(
          maxTop,
          Math.max(
            padding,
            clamped[i].top +
              (Math.floor(Math.random() * (delta * 2 + 1)) - delta)
          )
        );
        clamped[i].left = candidateLeft;
        clamped[i].top = candidateTop;
        attempts++;
      }
    }

    setPositions(clamped);
  }, [circleSize, width, height]);

  // swipe handling: upward swipe increases size, downward swipe decreases size
  const [swipeProcessed, setSwipeProcessed] = useState(false);
  const onGestureEvent = (event: any) => {
    const { translationY, velocityY } = event.nativeEvent;
    if (translationY < -100 && velocityY < -500 && !swipeProcessed) {
      setSwipeProcessed(true);
      const current = settings.size;
      if (current < 4) updateSetting("size", (current + 1) as any);
    }
    if (translationY > 100 && velocityY > 500 && !swipeProcessed) {
      setSwipeProcessed(true);
      const current = settings.size;
      if (current > 0) updateSetting("size", (current - 1) as any);
    }
    // horizontal swipes change color scheme: right -> previous, left -> next
    const { translationX, velocityX } = event.nativeEvent;
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
  };

  const onHandlerStateChange = () => {
    setTimeout(() => setSwipeProcessed(false), 120);
  };

  // double-tap (2 taps) -> regenerate positions
  const onDoubleTapStateChange = (event: any) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      const newPos = generatePositions(count, width, height, circleSize, 8);
      setPositions(newPos);
    }
  };

  return (
    <GestureHandlerRootView
      style={[
        styles.container,
        { backgroundColor: colorScheme.background || "#FFFFFF" },
      ]}
    >
      <TapGestureHandler
        numberOfTaps={3}
        maxDelayMs={300}
        onHandlerStateChange={onDoubleTapStateChange}
      >
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
        >
          <View
            style={styles.container}
            onTouchStart={() => startPulseAll()}
            onTouchEnd={() => stopPulseAll()}
            onTouchCancel={() => stopPulseAll()}
          >
            {positions.map((p) => {
              const scale = scalesRef.current[p.id] ?? new Animated.Value(1);
              return (
                <Animated.View
                  key={p.id}
                  style={[
                    styles.circle,
                    {
                      left: p.left,
                      top: p.top,
                      backgroundColor: circleColor,
                      width: circleSize,
                      height: circleSize,
                      borderRadius: circleSize / 2,
                      transform: [{ scale }],
                    },
                  ]}
                >
                  <Pressable
                    style={{ flex: 1 }}
                    onPress={() => handleRemove(p.id)}
                  />
                </Animated.View>
              );
            })}
          </View>
        </PanGestureHandler>
      </TapGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  circle: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FF6B6B",
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.12)",
    elevation: 6,
    zIndex: 1000,
  },
});
