"use client";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { GUI } from "lil-gui";
import { useEffect, useRef } from "react";
import {
  BoxGeometry,
  Clock,
  LoadingManager,
  MathUtils,
  Mesh,
  TextureLoader,
} from "three";

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
const logoTexture =
  typeof window !== "undefined" ? textureLoader.load(logo.src) : null;

export const Box = ({ onResetClick }: { onResetClick: () => void }) => {
  const geometry = BoxGeometry;
  const { size, scene, gl, camera } = useThree();
  const clock = useRef(new Clock());
  const timeBetweenFrames = useRef(0);
  const fps = useRef(0);
  const guiRef = useRef<GUI | null>(null);
  const debugObjectRef = useRef({
    color: "#bb00ff",
    rotate: () => {
      if (meshRef.current) {
        gsap.to(meshRef.current.rotation, {
          x: meshRef.current.rotation.x + MathUtils.degToRad(360),
          duration: 1,
          ease: "power2.inOut",
        });
      }
    },
    reset: () => {
      onResetClick();
    },
    subdivision: 1,
  });
  const meshRef = useRef<Mesh>(null);
  useFrame(() => {
    if (meshRef.current) {
      // Animate Y position with sine wave - slower and smoother
      meshRef.current.position.y =
        Math.sin(clock.current.getElapsedTime() * 0.5) * 0.3;
    }
  });

  useEffect(() => {
    console.log("rendering box");
    // Create GUI only once
    if (!guiRef.current) {
      guiRef.current = new GUI({
        width: 300,
        title: "Box",
        touchStyles: 1,
      });
    }

    if (meshRef.current && guiRef.current) {
      const gui = guiRef.current;
      const mesh = meshRef.current;

      const tweaker = gui.addFolder("Tweaker");
      tweaker.add(mesh.position, "y").min(-3).max(3).step(0.01).name("Y");

      // toggle wireframe for the mesh's material
      // @ts-ignore
      tweaker.add(mesh.material, "wireframe").name("Wireframe");

      // add color picker for the mesh's material
      tweaker
        // @ts-ignore
        .addColor(debugObjectRef.current, "color")
        .onChange(() => {
          // @ts-ignore
          mesh.material.color.set(debugObjectRef.current.color);
        })
        .name("Color");

      tweaker
        .add(debugObjectRef.current, "subdivision")
        .name("Subdivision")
        .min(1)
        .max(10)
        .step(1)
        .onFinishChange(() => {
          mesh.geometry.dispose();
          mesh.geometry = new geometry(
            1,
            1,
            1,
            debugObjectRef.current.subdivision,
            debugObjectRef.current.subdivision,
            debugObjectRef.current.subdivision
          );
        });

      tweaker.add(debugObjectRef.current, "rotate").name("Rotate");
      tweaker.add(debugObjectRef.current, "reset").name("Reset");
    }

    // Cleanup function
    return () => {
      if (guiRef.current) {
        guiRef.current.destroy();
        guiRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <mesh
        ref={meshRef}
        rotation={[MathUtils.degToRad(45), MathUtils.degToRad(35), 0]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial map={logoTexture} />
      </mesh>
    </>
  );
};
