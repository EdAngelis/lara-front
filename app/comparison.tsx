import { Text, View } from "@/components/Themed";
import React, { useState } from "react";
import { StyleSheet, TouchableWithoutFeedback } from "react-native";

export default function ComparisonScreen() {
  // Array of letters to cycle through
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // State to keep track of current letter index
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);

  // Function to change to next letter
  const changeToNextLetter = () => {
    setCurrentLetterIndex((prevIndex) => (prevIndex + 1) % letters.length);
  };

  return (
    <TouchableWithoutFeedback onPress={changeToNextLetter}>
      <View style={styles.container}>
        <Text style={styles.letter}>{letters[currentLetterIndex]}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
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
