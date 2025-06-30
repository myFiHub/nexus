"use server";

import { revalidatePath } from "next/cache";

export async function revalidateAllOutpostsPage() {
  revalidatePath(`/all_outposts`);
}
