"use client";
import { useOnGoingOutpostSlice } from "app/containers/ongoingOutpost/slice";
import { OutpostModel } from "app/services/api/types";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/Button";

interface JoinButtonProps {
  outpost: OutpostModel;
}

export function JoinButton({ outpost }: JoinButtonProps) {
  useOnGoingOutpostSlice();
  const router = useRouter();

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
