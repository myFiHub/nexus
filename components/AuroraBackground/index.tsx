const BLOBS = [
  { color: "var(--p-accent)", x: "10%", y: "5%", size: "75vmax", alpha: 0.27, anim: "aurora-drift-a", delay: "0s" },
  { color: "var(--p-violet)", x: "95%", y: "30%", size: "80vmax", alpha: 0.31, anim: "aurora-drift-b", delay: "-9.24s" },
  { color: "var(--p-magenta)", x: "15%", y: "85%", size: "70vmax", alpha: 0.22, anim: "aurora-drift-a", delay: "-18.48s" },
  { color: "var(--p-accent)", x: "85%", y: "95%", size: "55vmax", alpha: 0.14, anim: "aurora-drift-b", delay: "-14s" },
];

/** Fixed, decorative drifting glow behind every page; scaled by the palette's glow. */
export const AuroraBackground = () => (
  <div
    aria-hidden
    className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    style={{ opacity: "var(--p-glow)" }}
  >
    {BLOBS.map((blob, i) => (
      <div
        key={i}
        className="aurora-blob"
        style={{
          left: blob.x,
          top: blob.y,
          width: blob.size,
          height: blob.size,
          marginLeft: `calc(${blob.size} / -2)`,
          marginTop: `calc(${blob.size} / -2)`,
          background: `radial-gradient(closest-side, color-mix(in oklab, ${blob.color} ${
            blob.alpha * 100
          }%, transparent), transparent)`,
          animationName: blob.anim,
          animationDelay: blob.delay,
        }}
      />
    ))}
  </div>
);
