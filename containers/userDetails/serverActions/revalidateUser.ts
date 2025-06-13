"use server";

import { revalidatePath } from "next/cache";

export async function revalidateUserProfile(userId: string) {
  revalidatePath(`/user/${userId}`);
}
