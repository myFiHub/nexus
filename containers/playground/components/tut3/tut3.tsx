"use client";
import { SRGBColorSpace } from "three";

import doorAlpha from "./assets/door/alpha.jpg";
import doorAmbientOcclusion from "./assets/door/ambientOcclusion.jpg";
import doorHeight from "./assets/door/height.jpg";
import doorMetalness from "./assets/door/metalness.jpg";
import doorNormal from "./assets/door/normal.jpg";
import doorRoughness from "./assets/door/roughness.jpg";
import { Card } from "./cards/card";
import { MovingBox, Sphere, Torus } from "./components";
import { textureLoader } from "./utils/textureLoader";

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

export const Box = () => {
  return (
    <>
      <MovingBox />
      <Torus position={[2.5, 0, 0]} />
      <Sphere position={[-2, 0, 0]} />
      <Card position={[0, 3, 0]} />
    </>
  );
};
