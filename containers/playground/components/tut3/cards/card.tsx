"use client";
import { useRef } from "react";
import { Mesh, Texture } from "three";
import { createRoundedRectShape } from "./createShape";

interface CardProps {
  texture: Texture;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  width?: number;
  height?: number;
  thickness?: number;
  cornerRadius?: number;
  curveSegments?: number;
}

export const Card = ({
  texture,
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
        <meshMatcapMaterial matcap={texture} />
      </mesh>
    </group>
  );
};
