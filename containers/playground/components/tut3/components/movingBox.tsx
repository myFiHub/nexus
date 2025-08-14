import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Clock, MathUtils, Mesh } from "three";
import { InitialPositionProps } from "../types";
import { textureLoader } from "../utils/textureLoader";
import logo from "./logo.png";

const logoTexture =
  typeof window !== "undefined" ? textureLoader.load(logo.src) : null;

export const MovingBox = ({
  position = [0, 0, 0],
  rotation = [MathUtils.degToRad(45), MathUtils.degToRad(35), 0],
  scale = [1, 1, 1],
}: InitialPositionProps) => {
  const meshRef = useRef<Mesh>(null);
  const clock = useRef(new Clock());

  useFrame(() => {
    if (meshRef.current) {
      // Animate Y position with sine wave - slower and smoother
      meshRef.current.position.y =
        position[1] + Math.sin(clock.current.getElapsedTime() * 0.5) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial map={logoTexture} />
    </mesh>
  );
};
