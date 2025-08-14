import gradient from "../assets/gradients/3.jpg";
import { InitialPositionProps } from "../types";
import { textureLoader } from "../utils/textureLoader";

const gradientTexture =
  typeof window !== "undefined" ? textureLoader.load(gradient.src) : null;

interface SphereProps extends InitialPositionProps {
  radius?: number;
  widthSegments?: number;
  heightSegments?: number;
}

export const Sphere = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  radius = 1,
  widthSegments = 32,
  heightSegments = 32,
}: SphereProps) => {
  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <sphereGeometry args={[radius, widthSegments, heightSegments]} />
      <meshMatcapMaterial matcap={gradientTexture} />
    </mesh>
  );
};
