"use client";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Box } from "./box";

export const Tut1 = () => {
  return (
    <Canvas
      style={{
        height: "calc(100vh - 100px)",
        width: "100%",
      }}
      camera={{
        position: [0, 0, 10],
      }}
    >
      <directionalLight position={[5, 5, 5]} />
      <directionalLight position={[-5, -5, -5]} />

      <gridHelper args={[10, 10]} />
      <Box />
      {/* <PodiumCoin /> */}
      <OrbitControls />
    </Canvas>
  );
};

// Export individual components for standalone use
export { Box } from "./box";
