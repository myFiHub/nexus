"use client";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Button } from "../../../components/Button";
import { outpostDetailsSelectors } from "../selectors";

interface JoinButtonProps {}

export function JoinButton({}: JoinButtonProps) {
  const router = useRouter();
  const outpost = useSelector(outpostDetailsSelectors.outpost);
  if (!outpost) return null;
  const join = () => {
    router.push(`/ongoing_outpost/${outpost.uuid}`);
  };
  return (
    <Button className="w-full" onClick={join}>
      Join Event
    </Button>
  );
}
