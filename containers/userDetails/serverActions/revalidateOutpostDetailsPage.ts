"use server";

import { revalidatePath } from "next/cache";

export async function revalidateOutpostDetailsPage(outpostId: string) {
  revalidatePath(`/outpost_details/${outpostId}`);
}
