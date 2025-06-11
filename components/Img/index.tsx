"use client";

import { useEffect, useState } from "react";
import styles from "./styles.module.css";

interface ImgProps {
  src?: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Img = ({ src, alt, className, style }: ImgProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Generate fallback URL using UI Avatars
  const fallbackUrl = `https://ui-avatars.com/api/?name=${alt.replaceAll(
    " ",
    "+"
  )}.png`;

  // Reset states when src changes
  useEffect(() => {
    setIsLoading(true);
    setError(false);
  }, [src]);

  return (
    <div className={`${styles.container} ${className || ""}`} style={style}>
      {/* Shimmer effect */}
      {isLoading && <div className={styles.shimmer} />}

      {/* Image */}
      <img
        src={error || !src ? fallbackUrl : src}
        alt={alt}
        className={`${styles.image} ${isLoading ? styles.loading : ""} `}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true);
          setIsLoading(false);
        }}
        draggable={false}
      />
    </div>
  );
};
