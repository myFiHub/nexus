"use client";
import { confettiEventBus } from "app/containers/ongoingOutpost/eventBusses/confetti";
import { IncomingMessageType } from "app/services/wsClient";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Subscription } from "rxjs";

// Icon components for different reaction types
const HeartIcon = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={color}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const LikeIcon = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={color}>
    <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
  </svg>
);

const DislikeIcon = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={color}>
    <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" />
  </svg>
);

const CheerIcon = ({ color }: { color: string }) => (
  <div
    className="w-6 h-6"
    style={{
      maskImage: "url(/cheer.png)",
      maskSize: "contain",
      maskRepeat: "no-repeat",
      maskPosition: "center",
      backgroundColor: color,
      WebkitMaskImage: "url(/cheer.png)",
      WebkitMaskSize: "contain",
      WebkitMaskRepeat: "no-repeat",
      WebkitMaskPosition: "center",
    }}
  />
);

const BooIcon = ({ color }: { color: string }) => (
  <div
    className="w-6 h-6"
    style={{
      maskImage: "url(/boo.png)",
      maskSize: "contain",
      maskRepeat: "no-repeat",
      maskPosition: "center",
      backgroundColor: color,
      WebkitMaskImage: "url(/boo.png)",
      WebkitMaskSize: "contain",
      WebkitMaskRepeat: "no-repeat",
      WebkitMaskPosition: "center",
    }}
  />
);

const StarIcon = ({ color }: { color: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={color}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

interface ConfettiPiece {
  id: string;
  type: IncomingMessageType;
  x: number;
  delay: number;
}

const likeColors = ["#4CAF50", "#45a049", "#66BB6A"];
const dislikeColors = ["#f44336", "#d32f2f", "#ef5350"];
const cheerColors = ["#4CAF50", "#45a049", "#66BB6A"];
const booColors = ["#f44336", "#d32f2f", "#ef5350"];
const heartColors = ["#f93963", "#a10864", "#ee0b93"];

function getConfettiConfig(type: IncomingMessageType): {
  colors: string[];
  gravity: number;
} {
  switch (type) {
    case IncomingMessageType.USER_LIKED:
      return { colors: likeColors, gravity: -1 };
    case IncomingMessageType.USER_DISLIKED:
      return { colors: dislikeColors, gravity: 1 };
    case IncomingMessageType.USER_CHEERED:
      return { colors: cheerColors, gravity: -1 };
    case IncomingMessageType.USER_BOOED:
      return { colors: booColors, gravity: 1 };
    default:
      return { colors: heartColors, gravity: 1 };
  }
}

function getIconForType(type: IncomingMessageType, color: string) {
  switch (type) {
    case IncomingMessageType.USER_LIKED:
      return <LikeIcon color={color} />;
    case IncomingMessageType.USER_DISLIKED:
      return <DislikeIcon color={color} />;
    case IncomingMessageType.USER_CHEERED:
      return <CheerIcon color={color} />;
    case IncomingMessageType.USER_BOOED:
      return <BooIcon color={color} />;
    default:
      return <HeartIcon color={color} />;
  }
}

export const ConfettiContainer = ({ address }: { address: string }) => {
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    let subscription: Subscription;
    if (address) {
      subscription = confettiEventBus.subscribe(
        ({ address: eventAddress, type }) => {
          if (eventAddress === address) {
            // Create multiple confetti pieces
            const pieces: ConfettiPiece[] = [];
            const { colors, gravity } = getConfettiConfig(type);

            // Determine number of pieces based on reaction type
            const pieceCount =
              type === IncomingMessageType.USER_CHEERED ||
              type === IncomingMessageType.USER_BOOED
                ? 15
                : 2;

            for (let i = 0; i < pieceCount; i++) {
              pieces.push({
                id: `${Date.now()}-${i}`,
                type,
                x: Math.random() * 100, // Random horizontal position
                delay: Math.random() * 0.5, // Random delay
              });
            }

            setConfettiPieces((prev) => [...prev, ...pieces]);

            // Clean up pieces after animation
            setTimeout(() => {
              setConfettiPieces((prev) =>
                prev.filter((piece) => !pieces.find((p) => p.id === piece.id))
              );
            }, 4000);
          }
        }
      );
    }
    return () => {
      subscription?.unsubscribe();
    };
  }, [address]);

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible z-10">
      <AnimatePresence>
        {confettiPieces.map((piece) => {
          const { colors, gravity } = getConfettiConfig(piece.type);
          const color = colors[Math.floor(Math.random() * colors.length)];

          return (
            <motion.div
              key={piece.id}
              className="absolute pointer-events-none"
              style={{
                left: `${piece.x}%`,
                top: gravity > 0 ? "-20px" : "100%",
                zIndex: 9999,
              }}
              initial={{
                y: 0,
                x: 0,
                rotate: 0,
                scale: 0,
                opacity: 0,
              }}
              animate={{
                y: gravity > 0 ? "120px" : "-120px",
                x: [0, Math.random() * 60 - 30, Math.random() * 60 - 30],
                rotate: [0, 180, 360],
                scale: [0, 1.2, 1],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 3,
                delay: piece.delay,
                ease: "easeOut",
              }}
              exit={{
                opacity: 0,
                scale: 0,
              }}
            >
              <div className="text-2xl drop-shadow-lg">
                {getIconForType(piece.type, color)}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
