"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
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
  useImgTag?: boolean;
  id?: string;
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
  useImgTag = false,
  id,
}: ImgProps) => {
  const [imageState, setImageState] = useState<"loading" | "loaded" | "error">(
    "loading"
  );
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate fallback URL using UI Avatars
  const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    alt
  )}&size=200&background=random`;

  // Determine the actual source to use
  const imageSrc = imageState === "error" || !src ? fallbackUrl : src;

  // Determine if we should use fill mode
  const shouldUseFill = fill || (!width && !height);

  // Reset state when src changes
  useEffect(() => {
    setImageState("loading");
  }, [src]);

  // Check if image is already loaded (for cached images)
  useEffect(() => {
    if (useImgTag && imgRef.current && imageSrc) {
      const img = imgRef.current;

      // If image is already complete (cached), mark as loaded
      if (img.complete) {
        setImageState("loaded");
      }

      // Set up a fallback timeout
      const timeout = setTimeout(() => {
        if (imageState === "loading") {
          setImageState("loaded"); // Assume loaded if no error after timeout
        }
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [imageSrc, useImgTag, imageState]);

  const handleLoad = useCallback(() => {
    setImageState("loaded");
  }, []);

  const handleError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      setImageState("error");
      onError?.(e);
    },
    [onError]
  );

  // For regular img tag - use a more reliable approach
  if (useImgTag) {
    return (
      <div className={`${styles.container} ${className || ""}`} style={style}>
        {/* Shimmer effect during loading */}
        {imageState === "loading" && <div className={styles.shimmer} />}

        {/* Error fallback */}
        {imageState === "error" && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
            <div className="text-center text-muted-foreground">
              <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-muted-foreground/20 flex items-center justify-center">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="text-xs">Image unavailable</span>
            </div>
          </div>
        )}

        {/* Regular img tag */}
        <img
          ref={imgRef}
          src={imageSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          id={id}
          className={`${styles.image} ${
            imageState === "loading" ? styles.loading : ""
          }`}
          draggable={false}
          style={{
            width: shouldUseFill ? "100%" : width,
            height: shouldUseFill ? "100%" : height,
            opacity: imageState === "loaded" ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />
      </div>
    );
  }

  // For Next.js Image component
  return (
    <div className={`${styles.container} ${className || ""}`} style={style}>
      {/* Shimmer effect during loading */}
      {imageState === "loading" && <div className={styles.shimmer} />}

      {/* Error fallback */}
      {imageState === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
          <div className="text-center text-muted-foreground">
            <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-muted-foreground/20 flex items-center justify-center">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-xs">Image unavailable</span>
          </div>
        </div>
      )}

      {/* Next.js Image */}
      <Image
        src={imageSrc}
        id={id}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`${styles.image} ${
          imageState === "loading" ? styles.loading : ""
        }`}
        draggable={false}
        width={shouldUseFill ? undefined : width}
        height={shouldUseFill ? undefined : height}
        fill={shouldUseFill}
        sizes={sizes || (shouldUseFill ? "100vw" : undefined)}
        unoptimized={
          imageSrc.startsWith("blob:") || imageSrc.startsWith("data:")
        }
        style={{
          opacity: imageState === "loaded" ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />
    </div>
  );
};
