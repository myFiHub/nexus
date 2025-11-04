"use server";

import { revalidateTag } from "next/cache";

/**
 * Revalidates the outpost details cache tag
 * @param outpostId - The outpost ID to revalidate cache for
 */
export async function revalidateOutpostDetails(outpostId: string) {
  if (!outpostId) {
    throw new Error("Outpost ID is required");
  }
  revalidateTag(`outpost-details-${outpostId}`, "hours");
}
