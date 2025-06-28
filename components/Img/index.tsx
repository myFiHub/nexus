"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";

interface ImgProps {
  src?: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
}

export const Img = ({
  src,
  alt,
  className,
  style,
  onError,
  width,
  height,
  fill = false,
  sizes,
}: ImgProps) => {
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

  const imageSrc = error || !src ? fallbackUrl : src;

  // Determine if we should use fill mode
  const shouldUseFill = fill || (!width && !height);

  return (
    <div className={`${styles.container} ${className || ""}`} style={style}>
      {/* Shimmer effect */}
      {isLoading && <div className={styles.shimmer} />}

      {/* Image */}
      <Image
        onError={(e) => {
          setError(true);
          setIsLoading(false);
          onError?.(e);
        }}
        onLoad={() => setIsLoading(false)}
        src={imageSrc}
        alt={alt}
        className={`${styles.image} ${isLoading ? styles.loading : ""} `}
        draggable={false}
        width={shouldUseFill ? undefined : width}
        height={shouldUseFill ? undefined : height}
        fill={shouldUseFill}
        sizes={sizes || (shouldUseFill ? "100vw" : undefined)}
        unoptimized={
          imageSrc.startsWith("blob:") || imageSrc.startsWith("data:")
        }
      />
    </div>
  );
};
