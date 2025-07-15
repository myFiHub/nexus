"use client";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Clock, MathUtils, Mesh } from "three";
import { PodiumCoin } from "./PodiumCoin";

export const Box = () => {
  const { size, scene, gl, camera } = useThree();
  const clock = useRef(new Clock());
  const timeBetweenFrames = useRef(0);
  const fps = useRef(0);
  const meshRef = useRef<Mesh>(null);
  useFrame(() => {
    // if (meshRef.current) {
    //   timeBetweenFrames.current = clock.current.getDelta();
    //   fps.current = 1 / timeBetweenFrames.current;
    //   console.log(fps.current);
    // }
  });

  return (
    <>
      <directionalLight position={[5, 5, 5]} />
      <mesh
        ref={meshRef}
        rotation={[MathUtils.degToRad(45), MathUtils.degToRad(35), 0]}
      >
        <boxGeometry />
        <meshStandardMaterial color="red" />
      </mesh>
      <PodiumCoin />
    </>
  );
};
