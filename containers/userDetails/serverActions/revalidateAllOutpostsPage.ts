"use server";

import { AppPages } from "app/lib/routes";
import { revalidatePath } from "next/cache";

export async function revalidateAllOutpostsPage() {
  revalidatePath(AppPages.allOutposts);
}
