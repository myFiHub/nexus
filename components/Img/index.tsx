"use client";

import { useEffect, useState } from "react";
import styles from "./styles.module.css";

interface ImgProps {
  src?: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

export const Img = ({ src, alt, className, style, onError }: ImgProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Generate fallback URL using UI Avatars
  const fallbackUrl = `https://ui-avatars.com/api/?name=${alt.replaceAll(
    " ",
    "+"
  )}.png`;

  // Reset states when src changes
  useEffect(() => {
    const img = new Image();
    img.src = src || fallbackUrl;

    if (img.complete) {
      setIsLoading(false);
    } else {
      img.onload = () => setIsLoading(false);
      img.onerror = () => {
        setError(true);
        setIsLoading(false);
      };
    }

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, fallbackUrl]);

  return (
    <div className={`${styles.container} ${className || ""}`} style={style}>
      {/* Shimmer effect */}
      {isLoading && <div className={styles.shimmer} />}

      {/* Image */}
      <img
        onError={onError}
        src={error || !src ? fallbackUrl : src}
        alt={alt}
        className={`${styles.image} ${isLoading ? styles.loading : ""} `}
        draggable={false}
      />
    </div>
  );
};
