"use client";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { GUI } from "lil-gui";
import { useEffect, useRef } from "react";
import { BoxGeometry, Clock, MathUtils, Mesh } from "three";

export const Box = ({ onResetClick }: { onResetClick: () => void }) => {
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
      // Animate Y position with sine wave
      meshRef.current.position.y =
        Math.sin(clock.current.getElapsedTime() * 2) * 2;
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
      const cubeTweaker = gui.addFolder("Cube Tweaker");
      cubeTweaker.add(mesh.position, "y").min(-3).max(3).step(0.01).name("Y");

      // toggle wireframe for the mesh's material
      // @ts-ignore
      cubeTweaker.add(mesh.material, "wireframe").name("Wireframe");

      // add color picker for the mesh's material
      cubeTweaker
        // @ts-ignore
        .addColor(debugObjectRef.current, "color")
        .onChange(() => {
          // @ts-ignore
          mesh.material.color.set(debugObjectRef.current.color);
        })
        .name("Color");

      cubeTweaker
        .add(debugObjectRef.current, "subdivision")
        .name("Subdivision")
        .min(1)
        .max(10)
        .step(1)
        .onFinishChange(() => {
          mesh.geometry.dispose();
          mesh.geometry = new BoxGeometry(
            1,
            1,
            1,
            debugObjectRef.current.subdivision,
            debugObjectRef.current.subdivision,
            debugObjectRef.current.subdivision
          );
        });

      cubeTweaker.add(debugObjectRef.current, "rotate").name("Rotate");
      cubeTweaker.add(debugObjectRef.current, "reset").name("Reset");
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
        <boxGeometry />
        <meshStandardMaterial color={debugObjectRef.current.color} />
      </mesh>
    </>
  );
};
