import { Img } from "app/components/Img";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const loadingMessages = [
  "Establishing secure connection to the outpost...",
  "Loading real-time communication protocols...",
  "Preparing your personalized experience...",
  "Synchronizing with other members...",
  "Initializing voice and video channels...",
  "Setting up your virtual environment...",
  "Configuring privacy and security settings...",
  "Loading community features and tools...",
  "Almost ready to join the conversation...",
  "Final preparations for your arrival...",
];

export const JoiningStatus = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Rotate through loading messages every 3 seconds
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 10000);

    // Simulate progress with non-linear progression (fast start, slow end, never finishes)
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) return prev; // Stop at 85% instead of 95%

        // Calculate progress increment based on current progress
        // Start very fast (high increment) and slow down as progress increases
        const baseIncrement = 2.5;
        const slowdownFactor = Math.max(0.1, 1 - (prev / 85) * 0.9); // Slows down to 10% of original speed
        const increment = baseIncrement * slowdownFactor;

        return Math.min(85, prev + increment);
      });
    }, 400); // Faster updates for smoother animation

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="inset-0 flex items-center justify-center z-10 bg-background/80 backdrop-blur-sm absolute w-full h-[100vh] -top-[270px] overflow-hidden">
      <div className="flex flex-col items-center gap-6 max-w-md mx-auto px-4">
        {/* Main loading animation */}
        <motion.div
          className="relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full" />
          <motion.div
            className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-secondary rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        {/* Pulsing dots */}
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-primary rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Img
            className="w-8 h-8"
            src={"/outpost.png"}
            alt="outpost"
            useImgTag
          />
          <span className="text-lg font-bold">Entering the Outpost</span>
        </div>

        {/* Rotating loading messages */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMessageIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center min-h-[3rem] flex items-center justify-center w-full"
          >
            <p className="text-lg text-muted-foreground">
              {loadingMessages[currentMessageIndex]}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Progress bar with animation */}
        <div className="w-full max-w-xs">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-80 h-3 bg-muted rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
            <motion.div
              className="absolute inset-0 bg-white/30 rounded-full"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
