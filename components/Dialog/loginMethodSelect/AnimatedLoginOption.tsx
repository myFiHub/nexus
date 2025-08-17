"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface AnimatedLoginOptionProps {
  imagePaths: string[];
  title: string;
  subtitle: string;
  onClick?: () => void;
}

const AnimatedLoginOption = ({
  imagePaths,
  title,
  subtitle,
  onClick,
}: AnimatedLoginOptionProps) => {
  const optionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
  };

  const iconVariants = {
    hidden: { scale: 0 },
    visible: { scale: 1 },
    hover: { scale: 1.1 },
  };

  const glowVariants = {
    animate: {
      boxShadow: [
        "0 0 0 0 hsl(var(--primary) / 0)",
        "0 0 0 4px hsl(var(--primary) / 0.1)",
        "0 0 0 0 hsl(var(--primary) / 0)",
      ],
    },
  };

  const loopIcons = [...imagePaths, ...imagePaths]; // duplicate for seamless loop
  const rowGapPx = 6;
  const iconSizePx = 16;
  const rowHeightPx = iconSizePx + rowGapPx; // vertical space per icon
  const trackHeightPx = rowHeightPx * imagePaths.length;
  const durationSeconds = 10; // overall scroll duration

  return (
    <motion.div
      variants={optionVariants}
      whileHover="hover"
      whileTap="tap"
      onClick={onClick || undefined}
      className="group cursor-pointer"
    >
      <motion.div
        className="relative p-6 bg-card/50 border border-border rounded-lg hover:border-primary/50 transition-colors duration-200"
        whileHover={{
          backgroundColor: "hsl(var(--card) / 0.8)",
        }}
      >
        <motion.div
          variants={glowVariants}
          animate="animate"
          className="absolute inset-0 rounded-lg pointer-events-none"
        />

        <div className="flex items-center space-x-4">
          <motion.div variants={iconVariants} className="relative">
            <div className="group-hover:scale-110 transition-transform duration-200 flex items-center justify-center">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative h-6 w-6 overflow-hidden">
                    {/* top/bottom fade masks */}
                    <div className="pointer-events-none absolute left-0 right-0 top-0 h-2 bg-gradient-to-b from-background to-transparent" />
                    <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-2 bg-gradient-to-t from-background to-transparent" />

                    <motion.div
                      className="flex flex-col items-center"
                      animate={{ y: [0, -trackHeightPx] }}
                      transition={{
                        duration: durationSeconds,
                        ease: "linear" as const,
                        repeat: Infinity,
                      }}
                    >
                      {loopIcons.map((src, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-center"
                          style={{ height: rowHeightPx }}
                        >
                          {(() => {
                            const needsMask =
                              src.includes("apple") ||
                              src.includes("x_platform");
                            if (needsMask) {
                              return (
                                <div
                                  aria-label={title}
                                  className="w-4 h-4"
                                  style={{
                                    backgroundColor: "#ffffff",
                                    WebkitMaskImage: `url(${src})`,
                                    maskImage: `url(${src})`,
                                    WebkitMaskRepeat: "no-repeat",
                                    maskRepeat: "no-repeat",
                                    WebkitMaskSize: "contain",
                                    maskSize: "contain",
                                    WebkitMaskPosition: "center",
                                    maskPosition: "center",
                                    width: iconSizePx,
                                    height: iconSizePx,
                                  }}
                                />
                              );
                            }
                            return (
                              <Image
                                src={src}
                                alt={title}
                                width={iconSizePx}
                                height={iconSizePx}
                                className="w-4 h-4"
                              />
                            );
                          })()}
                        </div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex-1">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          </div>

          <motion.div
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            initial={{ x: -10 }}
            whileHover={{ x: 0 }}
          >
            <div className="w-2 h-2 bg-primary rounded-full" />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AnimatedLoginOption;
