export interface Answers {
  userId?: string;
  numberOfItems: 1 | 2 | 3 | 4;
  type: "letter" | "number" | "shape";
  item: string;
  result: 0 | 1;
  size: number;
  colors: string[];
}
