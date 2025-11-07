export interface ColorScheme {
  name: string;
  letters: string;
  background: string;
  value: string;
}

export const COLOR_SCHEMES: ColorScheme[] = [
  {
    name: "Default",
    letters: "#007AFF",
    background: "#FFFFFF",
    value: "default",
  },
  {
    name: "Warm",
    letters: "#FF6B6B",
    background: "#FFFFFF",
    value: "warm",
  },
  {
    name: "Cool",
    letters: "#6C5CE7",
    background: "#FFFFFF",
    value: "cool",
  },
  {
    name: "Monochrome",
    letters: "#2D3436",
    background: "#FFFFFF",
    value: "monochrome",
  },
  {
    name: "Vibrant",
    letters: "#6C5CE7",
    background: "#FFFFFF",
    value: "vibrant",
  },
];
