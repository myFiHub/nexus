"use client";

import { extend } from "@pixi/react";
import { Button } from "app/components/Button";
import { Application, Container, Graphics } from "pixi.js";
import { useLayoutEffect, useRef } from "react";
import { createMovementController, MovementController } from "./movement";

extend({
  Container,
  Graphics,
});

// Generate random rectangles
function generateRandomRectangles(
  count: number,
  maxWidth: number,
  maxHeight: number
) {
  const rectangles = [];
  for (let i = 0; i < count; i++) {
    rectangles.push({
      x: Math.random() * (maxWidth - 50),
      y: Math.random() * (maxHeight - 50),
      width: 30 + Math.random() * 40,
      height: 30 + Math.random() * 40,
    });
  }
  return rectangles;
}

// Check collision between two rectangles
function checkCollision(
  rect1: { x: number; y: number; width: number; height: number },
  rect2: { x: number; y: number; width: number; height: number }
) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

export const Tut2 = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const movementControllerRef = useRef<MovementController | null>(null);
  const appRef = useRef<Application | null>(null);
  const graphicsRef = useRef<Graphics | null>(null);
  const randomRectanglesRef = useRef<any[]>([]);

  const setup = async () => {
    if (containerRef.current) {
      // Get full screen dimensions
      const containerWidth = window.innerWidth;
      const containerHeight = window.innerHeight;

      appRef.current = new Application();
      const app = appRef.current;
      await app.init({
        width: containerWidth,
        height: containerHeight,
      });
      containerRef.current.appendChild(app.canvas);
      app.renderer.resize(containerWidth, containerHeight);
      app.ticker.add(() => {
        app.renderer.render(app.stage);
      });

      // Generate and draw random rectangles
      const randomRectangles = generateRandomRectangles(
        10,
        containerWidth,
        containerHeight
      );
      randomRectanglesRef.current = randomRectangles;

      randomRectangles.forEach((rect) => {
        const randomGraphics = new Graphics();
        randomGraphics.beginFill(0x00ff00); // Green color
        randomGraphics.drawRect(0, 0, rect.width, rect.height);
        randomGraphics.endFill();
        randomGraphics.x = rect.x;
        randomGraphics.y = rect.y;
        app.stage.addChild(randomGraphics);
      });

      // Create the red rectangle
      const graphics = new Graphics();
      graphics.setFillStyle({ color: "red" });
      graphics.rect(0, 0, 20, 40);
      graphics.fill();

      // Place at bottom-center of screen
      graphics.x = (containerWidth - 20) / 2;
      graphics.y = containerHeight - 40;

      app.stage.addChild(graphics);
      graphicsRef.current = graphics;

      // Movement controller with collision detection
      movementControllerRef.current = createMovementController(
        graphics,
        3,
        (nextX: number, nextY: number) => {
          // Check collision with random rectangles
          const redRect = { x: nextX, y: nextY, width: 20, height: 40 };
          const hasCollision = randomRectangles.some((rect) =>
            checkCollision(redRect, rect)
          );

          if (hasCollision) {
            return false;
          }

          return true; // Allow movement
        }
      );
    }
  };

  useLayoutEffect(() => {
    setup();
    return () => {
      if (movementControllerRef.current) {
        movementControllerRef.current.destroy();
      }
      if (appRef.current) {
        appRef.current.destroy(true);
        appRef.current = null;
      }
    };
  }, []);

  const handleReset = () => {
    if (movementControllerRef.current) {
      movementControllerRef.current.destroy();
      movementControllerRef.current = null;
    }
    if (appRef.current) {
      appRef.current.destroy(true);
      appRef.current = null;
    }
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }
    setup();
  };

  return (
    <div>
      <Button onClick={handleReset}>reset</Button>
      <div className="w-screen h-screen" ref={containerRef}></div>
    </div>
  );
};
