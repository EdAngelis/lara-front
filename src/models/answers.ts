export interface Answers {
  userId?: string;
  mode: "comparison" | "assertive";
  type: "letter" | "number" | "shape";
  item: string;
  result: 0 | 1;
  size: number;
  colors: string[];
}
