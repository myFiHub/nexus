import { SRGBColorSpace } from "three";
import doorColor from "../assets/door/color.jpg";
import { InitialPositionProps } from "../types";
import { textureLoader } from "../utils/textureLoader";

// textures used as map and matcap, should have specified color space, since they are sopposed to be encoded in sRGB
// so we need to set the colorSpace to SRGBColorSpace
const doorColorTexture =
  typeof window !== "undefined" ? textureLoader.load(doorColor.src) : null;
if (doorColorTexture) {
  doorColorTexture.colorSpace = SRGBColorSpace;
}

interface TorusProps extends InitialPositionProps {
  radius?: number;
  tube?: number;
  radialSegments?: number;
  tubularSegments?: number;
}

export const Torus = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  radius = 1,
  tube = 0.4,
  radialSegments = 16,
  tubularSegments = 64,
}: TorusProps) => {
  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <torusGeometry args={[radius, tube, radialSegments, tubularSegments]} />
      <meshStandardMaterial map={doorColorTexture} />
    </mesh>
  );
};
