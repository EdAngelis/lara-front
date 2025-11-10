export interface ColorScheme {
  name: string;
  letters: string;
  background: string;
  value: string;
}

export const COLOR_SCHEMES: ColorScheme[] = [
  {
    name: "Default",
    letters: "#0000FF", // Pure blue
    background: "#FFFFFF", // White
    value: "default",
  },
  {
    name: "Warm",
    letters: "#FF0000", // Pure red
    background: "#FFFFFF", // White
    value: "warm",
  },
  {
    name: "Cool",
    letters: "#4B0082", // Indigo (dark purple)
    background: "#FFFFFF", // White
    value: "cool",
  },
  {
    name: "Monochrome",
    letters: "#000000", // Black
    background: "#FFFFFF", // White
    value: "monochrome",
  },
  {
    name: "Vibrant",
    letters: "#FF00FF", // Magenta
    background: "#000000", // Black
    value: "vibrant",
  },
  {
    name: "Forest",
    letters: "#00FF00", // Bright green
    background: "#000000", // Black
    value: "forest",
  },
  {
    name: "Ocean",
    letters: "#00BFFF", // Deep sky blue
    background: "#000000", // Black
    value: "ocean",
  },
  {
    name: "Sunset",
    letters: "#FFA500", // Bright orange
    background: "#000000", // Black
    value: "sunset",
  },
  {
    name: "Night",
    letters: "#FFFF00", // Yellow
    background: "#000000", // Black
    value: "night",
  },
  {
    name: "Berry",
    letters: "#FF1493", // Deep pink
    background: "#000000", // Black
    value: "berry",
  },
  {
    name: "Lime",
    letters: "#00FF00", // Lime green
    background: "#000000", // Black
    value: "lime",
  },
  {
    name: "Tangerine",
    letters: "#FF8C00", // Dark orange
    background: "#FFFFFF", // White
    value: "tangerine",
  },
  {
    name: "Royal",
    letters: "#4169E1", // Royal blue
    background: "#FFFFFF", // White
    value: "royal",
  },
  {
    name: "Crimson",
    letters: "#DC143C", // Crimson
    background: "#FFFFFF", // White
    value: "crimson",
  },
  {
    name: "Cyan",
    letters: "#00FFFF", // Cyan
    background: "#000000", // Black
    value: "cyan",
  },
];
