"use client";

import { LoginButton } from "app/components/header/LoginButton";
import { motion } from "framer-motion";
import { Shield, Sparkles, Users } from "lucide-react";

interface LoginPromptProps {
  title?: string;
  description?: string;
  className?: string;
}

export const LoginPrompt = ({
  title = "Welcome to Your Outposts",
  description = "Connect your wallet to access your personal outposts, manage your communities, and track your engagement.",
  className = "",
}: LoginPromptProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[60vh] px-4 py-12 ${className}`}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[var(--primary)]/10 to-transparent rounded-full blur-3xl"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-[var(--primary)]/5 to-transparent rounded-full blur-3xl"
          animate={{
            y: [0, 20, 0],
            x: [0, -10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Icon */}
        <motion.div
          className="relative mb-6"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            duration: 0.8,
            ease: "backOut",
            delay: 0.2,
          }}
          whileHover={{
            scale: 1.05,
            rotate: [0, -5, 5, 0],
          }}
        >
          <div className="w-20 h-20 bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/80 rounded-2xl flex items-center justify-center shadow-lg">
            <Users className="w-10 h-10 text-white" />
          </div>
          <motion.div
            className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 360],
            }}
            transition={{
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 3, repeat: Infinity, ease: "linear" },
            }}
          >
            <Sparkles className="w-4 h-4 text-white" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-3xl font-bold text-[var(--foreground)] mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {title}
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-[var(--muted-foreground)] text-lg mb-8 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {description}
        </motion.p>

        {/* Features list */}
        <motion.div
          className="space-y-3 mb-8 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {[
            { icon: Shield, text: "Secure wallet connection" },
            { icon: Users, text: "Manage your communities" },
            { icon: Sparkles, text: "Track your engagement" },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-3 text-[var(--muted-foreground)]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.5,
                delay: 1 + index * 0.1,
                ease: "easeOut",
              }}
              whileHover={{
                x: 5,
                scale: 1.02,
              }}
            >
              <motion.div
                className="w-6 h-6 bg-[var(--primary)]/10 rounded-full flex items-center justify-center"
                whileHover={{
                  scale: 1.2,
                  backgroundColor: "var(--primary)/20",
                }}
                transition={{ duration: 0.2 }}
              >
                <feature.icon className="w-3 h-3 text-[var(--primary)]" />
              </motion.div>
              <span className="text-sm">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Login button */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <LoginButton
            size="lg"
            className="w-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/90 hover:from-[var(--primary)]/90 hover:to-[var(--primary)] text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          />
        </motion.div>

        {/* Additional info */}
        <motion.p
          className="text-xs text-[var(--muted-foreground)] mt-6 opacity-70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          By connecting, you agree to our terms of service and privacy policy
        </motion.p>
      </motion.div>
    </div>
  );
};
