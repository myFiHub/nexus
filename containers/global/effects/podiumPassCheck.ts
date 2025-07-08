import { podiumTeamMembersAptosAddresses } from "app/lib/constants";
import { movementService } from "app/services/move/aptosMovement";
import { all } from "redux-saga/effects";

export function* hasPass({
  sellerAddress,
  buyerAddress,
}: {
  sellerAddress: string;
  buyerAddress: string;
}) {
  const bought: bigint | null = yield movementService.getMyBalanceOnPodiumPass({
    myAddress: buyerAddress,
    sellerAddress,
  });
  if (bought && bought > 0) {
    return true;
  }
  return false;
}

export function* hasCreatorPodiumPass({
  buyerAddress,
}: {
  buyerAddress: string;
}) {
  const results: boolean[] = yield all(
    podiumTeamMembersAptosAddresses.map((address) =>
      hasPass({ sellerAddress: address, buyerAddress })
    )
  );
  const res = results.some((result) => result);
  return res;
}
