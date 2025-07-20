import { Shape } from "three";

// Create a rounded rectangle shape
export const createRoundedRectShape = (
  width: number,
  height: number,
  radius: number
) => {
  const shape = new Shape();

  // Start from bottom-left corner
  shape.moveTo(-width / 2 + radius, -height / 2);

  // Bottom edge
  shape.lineTo(width / 2 - radius, -height / 2);

  // Bottom-right corner
  shape.quadraticCurveTo(
    width / 2,
    -height / 2,
    width / 2,
    -height / 2 + radius
  );

  // Right edge
  shape.lineTo(width / 2, height / 2 - radius);

  // Top-right corner
  shape.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2);

  // Top edge
  shape.lineTo(-width / 2 + radius, height / 2);

  // Top-left corner
  shape.quadraticCurveTo(
    -width / 2,
    height / 2,
    -width / 2,
    height / 2 - radius
  );

  // Left edge
  shape.lineTo(-width / 2, -height / 2 + radius);

  // Bottom-left corner
  shape.quadraticCurveTo(
    -width / 2,
    -height / 2,
    -width / 2 + radius,
    -height / 2
  );

  return shape;
};
