"use client";
import { getFilterDescription } from "app/app/(unauthenticated)/users/[filter]/_utils";
import { useHydrated } from "app/hooks/use-hydrated";
import { useEffect, useState } from "react";
import TextTransition, { presets } from "react-text-transition";
import { UserTags } from "../../../../app/(unauthenticated)/users/[filter]/_filters";

function AnimatedText({
  parts,
  interval = 5000,
}: {
  parts: string[];
  interval?: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (parts.length < 2) return;
    const timeout = setTimeout(
      () => setIndex((prev) => (prev + 1) % parts.length),
      interval
    );
    return () => clearTimeout(timeout);
  }, [index, interval, parts.length]);

  return (
    <span
      style={{
        display: "inline-block",
        whiteSpace: "nowrap",
        verticalAlign: "bottom",
      }}
    >
      <TextTransition springConfig={presets.wobbly} inline direction="up">
        {parts[index]}
      </TextTransition>
    </span>
  );
}

function Description({ filter }: { filter: UserTags }) {
  const description = getFilterDescription(filter, true);
  const isClient = useHydrated();

  if (description.includes("@@")) {
    const [staticStart, ...rest] = description.split("@@");
    const animatedParts = rest.length >= 3 ? rest.slice(0, -1) : rest;
    const staticEnd = rest.length >= 3 ? rest[rest.length - 1] : "";

    if (animatedParts.length > 0) {
      return (
        <span style={{ whiteSpace: "nowrap" }}>
          {staticStart}
          {isClient ? <AnimatedText parts={animatedParts} /> : animatedParts[0]}
          {staticEnd}
        </span>
      );
    }
  }
  return <>{description}</>;
}

export default Description;
