"use client";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { Box } from "./box";

export const Tut3 = () => {
  const [showBox, setShowBox] = useState(true);

  const handleClick = () => {
    setShowBox(false);
    setTimeout(() => {
      setShowBox(true);
    }, 10);
  };

  return (
    <>
      <Canvas
        style={{
          height: "calc(100vh - 100px)",
          width: "100%",
        }}
        camera={{
          position: [5, 10, 10],
        }}
      >
        <directionalLight position={[5, 5, 5]} />
        <directionalLight position={[-5, -5, -5]} />
        <ambientLight intensity={1} />

        <gridHelper args={[20, 20]} />
        {showBox ? <Box /> : <></>}
        {/* <PodiumCoin /> */}
        <OrbitControls />
      </Canvas>
    </>
  );
};

// Export individual components for standalone use
export { Box } from "./box";
