"use client";

import { extend } from "@pixi/react";
import { Button } from "app/components/Button";
import podiumApi from "app/services/api";
import {
  Application,
  Container,
  Graphics,
  Sprite,
  Text,
  Texture,
} from "pixi.js";
import { useLayoutEffect, useRef, useState } from "react";
import localLogoUrl from "./logo.png";
import { createMovementController, MovementController } from "./movement";
extend({
  Container,
  Graphics,
  Sprite,
  Text,
});

// Generate outpost corridor (15 on each side)
async function generateOutpostCorridor(containerHeight: number) {
  try {
    // Fetch outposts from API
    const outposts = await podiumApi.getOutposts(0, 30);

    if (outposts instanceof Error || !outposts.length) {
      console.error("Failed to fetch outposts:", outposts);
      return [];
    }

    const corridorOutposts = [];
    const verticalSpacing = 500; // 500px spacing between outposts
    const leftX = 50; // Distance from left edge
    const rightX = 300; // Distance from left edge

    // Generate 30 outposts total (15 on each side), extending upward from starting position
    for (let i = 0; i < 30; i++) {
      const outpostIndex = i % outposts.length;
      const outpost = outposts[outpostIndex];

      // Alternate between left and right side
      const isLeftSide = i % 2 === 0;
      const x = isLeftSide ? leftX : rightX;
      const y = 400 - Math.floor(i / 2) * verticalSpacing; // Group by pairs for vertical spacing

      corridorOutposts.push({
        x: x,
        y: y,
        width: 200,
        height: 150,
        outpost: outpost,
      });
    }

    return corridorOutposts;
  } catch (error) {
    console.error("Error generating outpost corridor:", error);
    return [];
  }
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
  const corridorOutpostsRef = useRef<any[]>([]);
  const cameraYRef = useRef<number>(0);
  const containerHeightRef = useRef<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const setup = async () => {
    if (containerRef.current) {
      setIsLoading(true);

      // Get full screen dimensions
      const containerWidth = window.innerWidth;
      const containerHeight = window.innerHeight;
      containerHeightRef.current = containerHeight;

      appRef.current = new Application();
      const app = appRef.current;
      await app.init({
        width: containerWidth,
        height: containerHeight,
      });
      containerRef.current.appendChild(app.canvas);
      app.renderer.resize(containerWidth, containerHeight);

      // Create a container for the world that can be moved (camera)
      const worldContainer = new Container();
      app.stage.addChild(worldContainer);

      // Generate outpost corridor
      const corridorOutposts = await generateOutpostCorridor(containerHeight);
      corridorOutpostsRef.current = corridorOutposts;

      // Draw outpost cards
      for (const outpostData of corridorOutposts) {
        const outpostContainer = new Container();
        outpostContainer.x = outpostData.x;
        outpostContainer.y = outpostData.y;

        // Create background rectangle
        const background = new Graphics();
        background.beginFill(0x2a2a2a); // Dark background
        background.drawRoundedRect(
          0,
          0,
          outpostData.width,
          outpostData.height,
          10
        );
        background.endFill();
        outpostContainer.addChild(background);

        // Load and display outpost image
        console.log("Attempting to load image:", outpostData.outpost.image);

        // Create a placeholder rectangle
        const imagePlaceholder = new Graphics();
        imagePlaceholder.beginFill(0x666666); // Gray placeholder
        imagePlaceholder.drawRect(0, 0, outpostData.width - 20, 80);
        imagePlaceholder.endFill();
        imagePlaceholder.x = 10;
        imagePlaceholder.y = 10;
        outpostContainer.addChild(imagePlaceholder);

        // Try to load the actual image using fetch
        fetch(outpostData.outpost.image ?? localLogoUrl)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.blob();
          })
          .then((blob) => createImageBitmap(blob))
          .then((imageBitmap) => {
            console.log(
              "Image loaded successfully:",
              outpostData.outpost.image ?? localLogoUrl
            );
            const texture = Texture.from(imageBitmap);
            const imageSprite = new Sprite(texture);
            imageSprite.width = outpostData.width - 20;
            imageSprite.height = 80;
            imageSprite.x = 10;
            imageSprite.y = 10;
            // Replace placeholder with actual image
            outpostContainer.removeChild(imagePlaceholder);
            outpostContainer.addChild(imageSprite);
          })
          .catch((error) => {
            console.error(
              "Failed to load outpost image:",
              outpostData.outpost.image ?? localLogoUrl,
              error
            );
            // Try to load the local logo as fallback
            console.log("Attempting to load fallback logo:", localLogoUrl.src);
            fetch(localLogoUrl.src)
              .then((response) => {
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.blob();
              })
              .then((blob) => createImageBitmap(blob))
              .then((imageBitmap) => {
                console.log("Fallback logo loaded successfully");
                const texture = Texture.from(imageBitmap);
                const imageSprite = new Sprite(texture);
                imageSprite.width = outpostData.width - 20;
                imageSprite.height = 80;
                imageSprite.x = 10;
                imageSprite.y = 10;
                // Replace placeholder with fallback logo
                outpostContainer.removeChild(imagePlaceholder);
                outpostContainer.addChild(imageSprite);
              })
              .catch((fallbackError) => {
                console.error("Failed to load fallback logo:", fallbackError);
                // Keep the placeholder if both images fail
              });
          });

        // Add outpost name text
        const nameText = new Text(outpostData.outpost.name, {
          fontSize: 14,
          fill: 0xffffff,
          wordWrap: true,
          wordWrapWidth: outpostData.width - 20,
        });
        nameText.x = 10;
        nameText.y = 100;
        outpostContainer.addChild(nameText);

        // Add creator name text
        const creatorText = new Text(
          `by ${outpostData.outpost.creator_user_name}`,
          {
            fontSize: 12,
            fill: 0xcccccc,
          }
        );
        creatorText.x = 10;
        creatorText.y = 120;
        outpostContainer.addChild(creatorText);

        worldContainer.addChild(outpostContainer);
      }

      // Create the red rectangle (player)
      const graphics = new Graphics();
      graphics.setFillStyle({ color: "red" });
      graphics.rect(0, 0, 20, 40);
      graphics.fill();

      // Place at center of screen
      graphics.x = (containerWidth - 20) / 2;
      graphics.y = containerHeight / 2;

      worldContainer.addChild(graphics);
      graphicsRef.current = graphics;

      // Movement controller with collision detection and camera scrolling
      movementControllerRef.current = createMovementController(
        graphics,
        3,
        (nextX: number, nextY: number) => {
          // Check collision with outpost cards
          const playerRect = { x: nextX, y: nextY, width: 20, height: 40 };
          const hasCollision = corridorOutposts.some((outpostData) => {
            const collision = checkCollision(playerRect, {
              x: outpostData.x,
              y: outpostData.y,
              width: outpostData.width,
              height: outpostData.height,
            });

            if (collision) {
              console.log("Collision with outpost:", outpostData.outpost.name);
            }
            return collision;
          });

          if (hasCollision) {
            return false;
          }

          // Camera scrolling logic - upward movement direction
          const screenCenterY = containerHeight / 2;
          const playerScreenY = nextY - cameraYRef.current;

          // Always keep player at center when moving
          if (nextY !== graphics.y) {
            cameraYRef.current = nextY - screenCenterY;
          }

          // Update world container position (camera)
          worldContainer.y = -cameraYRef.current;

          return true; // Allow movement
        }
      );

      // Animation loop for smooth rendering
      app.ticker.add(() => {
        app.renderer.render(app.stage);
      });

      setIsLoading(false);
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
    cameraYRef.current = 0;
    setup();
  };

  return (
    <div>
      <Button onClick={handleReset}>reset</Button>
      {isLoading && (
        <div className="absolute top-4 left-4 text-white">
          Loading outposts...
        </div>
      )}
      <div className="w-screen h-screen" ref={containerRef}></div>
    </div>
  );
};
