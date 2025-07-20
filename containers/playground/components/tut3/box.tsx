"use client";
import { RootState, useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import {
  Clock,
  LoadingManager,
  MathUtils,
  Mesh,
  SRGBColorSpace,
  TextureLoader,
} from "three";

import doorAlpha from "./assets/door/alpha.jpg";
import doorAmbientOcclusion from "./assets/door/ambientOcclusion.jpg";
import doorColor from "./assets/door/color.jpg";
import doorHeight from "./assets/door/height.jpg";
import doorMetalness from "./assets/door/metalness.jpg";
import doorNormal from "./assets/door/normal.jpg";
import doorRoughness from "./assets/door/roughness.jpg";
import gradient from "./assets/gradients/3.jpg";
import matcap from "./assets/matcaps/8.png";
import { Card } from "./cards/card";
import logo from "./logo.png";

const loaderManager = new LoadingManager();
loaderManager.onLoad = () => {
  console.log("loaded");
};
loaderManager.onProgress = (item, loaded, total) => {
  console.log("progress", item, loaded, total);
};
loaderManager.onError = (error) => {
  console.log("error", error);
};
loaderManager.onStart = (e) => {
  console.log("start", e);
};

const textureLoader = new TextureLoader(loaderManager);
// textures used as map and matcap, should have specified color space, since they are sopposed to be encoded in sRGB
// so we need to set the colorSpace to SRGBColorSpace
const doorColorTexture =
  typeof window !== "undefined" ? textureLoader.load(doorColor.src) : null;
if (doorColorTexture) {
  doorColorTexture.colorSpace = SRGBColorSpace;
}
const matcapTexture =
  typeof window !== "undefined" ? textureLoader.load(matcap.src) : null;
if (matcapTexture) {
  matcapTexture.colorSpace = SRGBColorSpace;
}

// door textures
const doorlphaTexture =
  typeof window !== "undefined" ? textureLoader.load(doorAlpha.src) : null;
const doorAmbientOcclusionTexture =
  typeof window !== "undefined"
    ? textureLoader.load(doorAmbientOcclusion.src)
    : null;
const doorHeightTexture =
  typeof window !== "undefined" ? textureLoader.load(doorHeight.src) : null;
const doorNormalTexture =
  typeof window !== "undefined" ? textureLoader.load(doorNormal.src) : null;
const doorMetalnessTexture =
  typeof window !== "undefined" ? textureLoader.load(doorMetalness.src) : null;
const doorRoughnessTexture =
  typeof window !== "undefined" ? textureLoader.load(doorRoughness.src) : null;
// gradient texture
const gradientTexture =
  typeof window !== "undefined" ? textureLoader.load(gradient.src) : null;

const logoTexture =
  typeof window !== "undefined" ? textureLoader.load(logo.src) : null;

export const Box = () => {
  const { size, scene, gl, camera }: RootState = useThree();
  const clock = useRef(new Clock());
  const timeBetweenFrames = useRef(0);
  const fps = useRef(0);

  const meshRef = useRef<Mesh>(null);
  useFrame(() => {
    if (meshRef.current) {
      // Animate Y position with sine wave - slower and smoother
      meshRef.current.position.y =
        Math.sin(clock.current.getElapsedTime() * 0.5) * 0.3;
    }
  });

  return (
    <>
      <mesh
        ref={meshRef}
        rotation={[MathUtils.degToRad(45), MathUtils.degToRad(35), 0]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial map={logoTexture} />
      </mesh>
      <mesh position={[2.5, 0, 0]}>
        <torusGeometry args={[1, 0.4, 16, 64]} />
        <meshStandardMaterial map={doorColorTexture} />
      </mesh>
      <mesh position={[-2, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshMatcapMaterial matcap={matcapTexture} />
      </mesh>
      <mesh position={[0, 3, 0]}>
        <Card texture={matcapTexture!} />
      </mesh>
    </>
  );
};
