"use client";

import { LoginButton } from "app/components/header/LoginButton";
import { motion } from "framer-motion";
import { Lock, Sparkles, User } from "lucide-react";

export const LoginPrompt = () => {
  return (
    <div className=" flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full"
      >
        {/* Main Card */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card rounded-2xl shadow-2xl border border-border/50 overflow-hidden"
        >
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 p-8 text-center">
            <motion.div
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4"
            >
              <Lock className="w-8 h-8 text-primary" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-2xl font-bold text-foreground mb-2"
            >
              Welcome to Your Profile
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-muted-foreground"
            >
              Sign in to access your personalized dashboard
            </motion.p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Features list */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-4 mb-8"
            >
              {[
                { icon: User, text: "View your profile and stats" },
                { icon: Sparkles, text: "Manage your connected accounts" },
                { icon: Lock, text: "Access your passes and settings" },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  className="flex items-center gap-3 text-sm text-muted-foreground"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-3 h-3 text-primary" />
                  </div>
                  <span>{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Login Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
              whileTap={{
                scale: 0.98,
                transition: { duration: 0.1 },
              }}
            >
              <LoginButton className="w-full" size="lg" />
            </motion.div>

            {/* Decorative elements */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="mt-6 text-center"
            >
              <div className="inline-flex items-center gap-2 text-xs text-muted-foreground/60">
                <div className="w-1 h-1 bg-primary/40 rounded-full animate-pulse" />
                <span>Secure authentication</span>
                <div className="w-1 h-1 bg-primary/40 rounded-full animate-pulse" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Floating decorative elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/20 rounded-full"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-secondary/20 rounded-full"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-primary/30 rounded-full"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 bg-secondary/25 rounded-full"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 2.0 }}
          className="absolute top-1/2 left-1/6 w-1 h-1 bg-primary/40 rounded-full"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 2.2 }}
          className="absolute bottom-1/6 right-1/6 w-2 h-2 bg-secondary/35 rounded-full"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 2.4 }}
          className="absolute top-1/6 right-1/4 w-1.5 h-1.5 bg-primary/25 rounded-full"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 2.6 }}
          className="absolute bottom-1/2 left-1/4 w-1 h-1 bg-secondary/30 rounded-full"
        />
      </motion.div>
    </div>
  );
};
