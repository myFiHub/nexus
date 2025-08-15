"use client";
import { useRef } from "react";
import { Mesh, SRGBColorSpace } from "three";
import matcap from "../assets/matcaps/8.png";
import { InitialPositionProps } from "../types";
import { textureLoader } from "../utils/textureLoader";
import { createRoundedRectShape } from "./createShape";

interface CardProps extends InitialPositionProps {
  width?: number;
  height?: number;
  thickness?: number;
  cornerRadius?: number;
  curveSegments?: number;
}
const matcapTexture =
  typeof window !== "undefined" ? textureLoader.load(matcap.src) : null;
if (matcapTexture) {
  matcapTexture.colorSpace = SRGBColorSpace;
}
export const Card = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  width = 1.5,
  height = 2.1,
  thickness = 0.02,
  cornerRadius = 0.1,
  curveSegments = 48,
}: CardProps) => {
  const meshRef = useRef<Mesh>(null);

  // Load image texture - use a fallback if the URL is invalid

  const cardShape = createRoundedRectShape(width, height, cornerRadius);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Card background */}
      <mesh ref={meshRef}>
        <extrudeGeometry
          args={[
            cardShape,
            {
              depth: thickness,
              bevelEnabled: false,
              curveSegments: curveSegments,
            },
          ]}
        />
        <meshMatcapMaterial matcap={matcapTexture} />
      </mesh>
    </group>
  );
};
