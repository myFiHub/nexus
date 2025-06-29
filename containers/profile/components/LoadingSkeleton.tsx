import { motion } from "framer-motion";

const LoadingSkeleton = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="bg-card rounded-lg shadow-md p-6"
        variants={itemVariants}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Profile Header Skeleton - matches ProfileHeader component */}
        <motion.div
          className="flex items-center space-x-6 mb-8"
          variants={itemVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.div
            className="w-32 h-32 rounded-full bg-muted flex-shrink-0"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <div className="flex-1 min-w-0 space-y-3">
            <motion.div
              className="h-8 w-64 bg-muted rounded"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="h-5 w-48 bg-muted rounded"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className="flex space-x-4">
              <motion.div
                className="h-4 w-20 bg-muted rounded"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="h-4 w-20 bg-muted rounded"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Balance Card Skeleton - matches UserStats balance section */}
        <motion.div
          className="mb-8"
          variants={itemVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-6 rounded-lg">
            <motion.div
              className="h-4 w-32 bg-muted rounded mb-2"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="h-8 w-24 bg-muted rounded"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>

        {/* Stats Grid Skeleton - matches UserStats StatCard grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          variants={itemVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="bg-muted p-4 rounded-lg"
              variants={itemVariants}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <motion.div
                className="h-4 w-20 bg-card rounded mb-2"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="h-6 w-12 bg-card rounded mb-1"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="h-3 w-24 bg-card rounded"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Connected Accounts Skeleton - matches ConnectedAccounts component */}
        <motion.div
          className="mb-8"
          variants={itemVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="flex items-center justify-between mb-4">
            <motion.div
              className="h-6 w-48 bg-muted rounded"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="h-8 w-24 bg-muted rounded"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <motion.div
                key={i}
                className="bg-muted p-4 rounded-lg"
                variants={itemVariants}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    className="w-10 h-10 rounded-full bg-card"
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <div className="flex-1">
                    <motion.div
                      className="h-4 w-32 bg-card rounded mb-1"
                      animate={{
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <motion.div
                      className="h-3 w-24 bg-card rounded"
                      animate={{
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </div>
                </div>
                <motion.div
                  className="h-3 w-28 bg-card rounded"
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional Info Skeleton - matches AdditionalInfo component */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
          variants={itemVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {[1, 2].map((i) => (
            <motion.div
              key={i}
              className="bg-muted p-4 rounded-lg"
              variants={itemVariants}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <motion.div
                className="h-5 w-32 bg-card rounded mb-3"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <div className="space-y-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex justify-between">
                    <motion.div
                      className="h-3 w-20 bg-card rounded"
                      animate={{
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <motion.div
                      className="h-3 w-32 bg-card rounded"
                      animate={{
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Settings Section Skeleton - matches SettingsSection component */}
        <motion.div
          className="mb-8"
          variants={itemVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.div
            className="h-6 w-32 bg-muted rounded mb-4"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <motion.div
                  className="h-5 w-48 bg-card rounded mb-2"
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="h-3 w-64 bg-card rounded"
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
              <motion.div
                className="w-8 h-4 bg-card rounded"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* My Passes Skeleton - matches MyPasses component */}
        <motion.div
          className="mt-8"
          variants={itemVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.div
            className="h-6 w-32 bg-muted rounded mb-4"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="bg-muted rounded-lg overflow-hidden"
                variants={itemVariants}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {/* Pass header with gradient */}
                <div className="h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 relative">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="w-16 h-16 rounded-full bg-card border-2 border-white/20"
                        animate={{
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      <div className="flex-1">
                        <motion.div
                          className="h-4 w-24 bg-card rounded mb-1"
                          animate={{
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                        <motion.div
                          className="h-3 w-16 bg-card rounded"
                          animate={{
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Pass content */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-4 h-4 bg-card rounded"
                      animate={{
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <motion.div
                      className="h-3 w-20 bg-card rounded"
                      animate={{
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </div>
                  <div>
                    <motion.div
                      className="h-3 w-24 bg-card rounded mb-2"
                      animate={{
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <motion.div
                      className="h-8 w-full bg-card rounded"
                      animate={{
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </div>
                  <motion.div
                    className="h-8 w-full bg-card rounded"
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default LoadingSkeleton;
