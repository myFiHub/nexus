"use client";

import { captureReferral } from "app/lib/referral";
import { useEffect } from "react";

export const ReferralCapture = () => {
  useEffect(captureReferral, []);
  return null;
};
