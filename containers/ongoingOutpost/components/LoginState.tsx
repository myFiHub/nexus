"use client";

import { LoginButton } from "app/components/header/LoginButton";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Mic,
  Shield,
  Sparkles,
  Users,
  Video,
} from "lucide-react";

export const LoginState = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-2xl w-full"
      >
        {/* Main Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card rounded-3xl shadow-2xl border border-border/50 overflow-hidden relative"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />

          {/* Header with gradient */}
          <div className="relative bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 p-8 text-center">
            <motion.div
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl mb-6 shadow-lg"
            >
              <Video className="w-10 h-10 text-primary" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-3xl font-bold text-foreground mb-3"
            >
              Join the Live Outpost
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-muted-foreground text-lg"
            >
              Sign in to participate in real-time conversations and connect with
              others
            </motion.p>
          </div>

          {/* Features Section */}
          <div className="p-8 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {/* Feature 1 */}
              <motion.div
                className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl"
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Mic className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Voice Chat</h4>
                  <p className="text-sm text-muted-foreground">
                    Real-time audio conversations
                  </p>
                </div>
              </motion.div>

              {/* Feature 2 */}
              <motion.div
                className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl"
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Live Chat</h4>
                  <p className="text-sm text-muted-foreground">
                    Interactive text messaging
                  </p>
                </div>
              </motion.div>

              {/* Feature 3 */}
              <motion.div
                className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl"
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ duration: 0.2, delay: 0.2 }}
              >
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Community</h4>
                  <p className="text-sm text-muted-foreground">
                    Connect with like-minded people
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Login Button Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center space-y-4"
            >
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>Secure Web3 authentication</span>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-block"
              >
                <LoginButton
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 rounded-xl shadow-lg"
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Floating decorative elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="absolute top-1/4 left-1/4 w-3 h-3 bg-primary/20 rounded-full"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute bottom-1/4 right-1/4 w-4 h-4 bg-secondary/20 rounded-full"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="absolute top-1/3 right-1/3 w-2 h-2 bg-primary/30 rounded-full"
        />

        {/* Animated sparkles */}
        <motion.div
          className="absolute top-1/4 right-1/4"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Sparkles className="w-6 h-6 text-primary/40" />
        </motion.div>

        <motion.div
          className="absolute bottom-1/3 left-1/6"
          animate={{
            rotate: [0, -360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
            delay: 1,
          }}
        >
          <Sparkles className="w-4 h-4 text-secondary/40" />
        </motion.div>
      </motion.div>
    </div>
  );
};
