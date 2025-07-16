import { Graphics } from "pixi.js";

export type CanMoveFn = (nextX: number, nextY: number) => boolean;

export class MovementController {
  private keysPressed: { [key: string]: boolean } = {};
  private animationFrameId: number | null = null;
  private target: Graphics | null = null;
  private position = { x: 0, y: 0 };
  private speed = 10;
  private canMove?: CanMoveFn;

  constructor(target: Graphics, speed: number = 10, canMove?: CanMoveFn) {
    this.target = target;
    this.speed = speed;
    this.position = { x: target.x, y: target.y };
    this.canMove = canMove;
    this.setupEventListeners();
    this.startMovement();
  }

  private setupEventListeners() {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["w", "a", "s", "d"].includes(e.key)) {
        this.keysPressed[e.key] = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (["w", "a", "s", "d"].includes(e.key)) {
        this.keysPressed[e.key] = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Store cleanup function
    this.cleanup = () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
    };
  }

  private move = () => {
    if (!this.target) return;

    let dx = 0,
      dy = 0;
    if (this.keysPressed["w"]) dy -= 1;
    if (this.keysPressed["s"]) dy += 1;
    if (this.keysPressed["a"]) dx -= 1;
    if (this.keysPressed["d"]) dx += 1;

    if (dx !== 0 || dy !== 0) {
      // Normalize for diagonal movement
      const length = Math.sqrt(dx * dx + dy * dy);
      const nextX = this.position.x + (dx / length) * this.speed;
      const nextY = this.position.y + (dy / length) * this.speed;
      if (!this.canMove || this.canMove(nextX, nextY)) {
        this.position.x = nextX;
        this.position.y = nextY;
        this.target.x = this.position.x;
        this.target.y = this.position.y;
      }
    }

    this.animationFrameId = requestAnimationFrame(this.move);
  };

  private startMovement() {
    this.animationFrameId = requestAnimationFrame(this.move);
  }

  public destroy() {
    if (this.cleanup) {
      this.cleanup();
    }
  }

  private cleanup?: () => void;
}

// Convenience function to create a movement controller
export const createMovementController = (
  target: Graphics,
  speed: number = 10,
  canMove?: CanMoveFn
) => {
  return new MovementController(target, speed, canMove);
};
