"use client";

import animation from "../../lotti/gold_medal.json";
import Lottie from "lottie-react";

export const AnimatedNumberOne = () => {
  return <Lottie animationData={animation} loop={true} />;
};
