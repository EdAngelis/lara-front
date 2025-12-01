import { ItemAccuracyCard } from "@/components/ItemAccuracyCard";
import { answersService, ItemAccuracy } from "@/service/answers.service";
import { useFocusEffect } from "@react-navigation/native";
import * as ScreenOrientation from "expo-screen-orientation";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function DashboardPage() {
  const [items, setItems] = useState<ItemAccuracy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("Could not lock screen orientation for dashboard:", e);
      }
    })();
    return () => {
      (async () => {
        try {
          await ScreenOrientation.unlockAsync();
        } catch (e) {
          // ignore
        }
      })();
    };
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await answersService.getItemsAccuracy();
      if (response && response.data) {
        setItems(response.data);
      }
    } catch (err) {
      setError("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.gridContainer}>
          {items.map((item) => (
            <ItemAccuracyCard key={item.item} data={item} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingVertical: 0,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 1,
    width: "100%",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});
