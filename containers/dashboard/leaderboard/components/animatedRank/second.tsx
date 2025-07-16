"use client";

import animation from "../../lotti/silver_coin.json";
import Lottie from "lottie-react";

export const AnimatedNumberTwo = () => {
  return <Lottie animationData={animation} loop={false} />;
};
