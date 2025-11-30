import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle, Polygon, Rect, Path } from "react-native-svg";

interface ShapeProps {
  shape: "square" | "circle" | "triangle" | "rectangle" | "star";
  color: string;
  size: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

export default function Shape({ shape, color, size }: ShapeProps) {
  // Map size to dimensions
  const getDimensions = () => {
    switch (size) {
      case 0:
        return 320;
      case 1:
        return 280;
      case 2:
        return 240;
      case 3:
        return 200;
      case 4:
        return 160;
      case 5:
        return 120;
      case 6:
        return 80;
      default:
        return 160;
    }
  };

  const dimension = getDimensions();

  const renderShape = () => {
    switch (shape) {
      case "circle":
        return (
          <Svg width={dimension} height={dimension}>
            <Circle
              cx={dimension / 2}
              cy={dimension / 2}
              r={dimension / 2}
              fill={color}
            />
          </Svg>
        );

      case "square":
        return (
          <Svg width={dimension} height={dimension}>
            <Rect width={dimension} height={dimension} fill={color} />
          </Svg>
        );

      case "rectangle":
        const rectWidth = dimension;
        const rectHeight = dimension * 0.6;
        return (
          <Svg width={rectWidth} height={rectHeight}>
            <Rect width={rectWidth} height={rectHeight} fill={color} />
          </Svg>
        );

      case "triangle":
        const trianglePoints = `${
          dimension / 2
        },0 ${dimension},${dimension} 0,${dimension}`;
        return (
          <Svg width={dimension} height={dimension}>
            <Polygon points={trianglePoints} fill={color} />
          </Svg>
        );

      case "star":
        // Generate star path with 5 points
        const starPath = generateStarPath(
          dimension / 2,
          dimension / 2,
          5,
          dimension / 2,
          dimension / 4
        );
        return (
          <Svg width={dimension} height={dimension}>
            <Path d={starPath} fill={color} />
          </Svg>
        );

      default:
        return null;
    }
  };

  return <View style={styles.container}>{renderShape()}</View>;
}

// Helper function to generate a star path
function generateStarPath(
  cx: number,
  cy: number,
  points: number,
  outerRadius: number,
  innerRadius: number
): string {
  let path = "";
  const angle = Math.PI / points;

  for (let i = 0; i < 2 * points; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const x = cx + radius * Math.sin(i * angle);
    const y = cy - radius * Math.cos(i * angle);

    if (i === 0) {
      path += `M ${x},${y}`;
    } else {
      path += ` L ${x},${y}`;
    }
  }

  path += " Z";
  return path;
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
