"use server";

import { AppPages } from "app/lib/routes";
import { revalidatePath, revalidateTag } from "next/cache";

export async function revalidateUserProfile(userId: string) {
  revalidatePath(AppPages.userDetails(userId));
}

/**
 * Revalidates specific user data cache tags
 * @param userId - The user ID to revalidate cache for
 * @param options - Object specifying which data to revalidate
 */
export async function revalidateUserData(
  userId: string,
  options: {
    userData?: boolean;
    passBuyers?: boolean;
    followers?: boolean;
    followings?: boolean;
    all?: boolean;
  } = { all: false }
) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  // If 'all' is true, revalidate all user-related cache tags
  if (options.all) {
    revalidateTag(`user-data-${userId}`, "hours");
    revalidateTag(`user-pass-buyers-${userId}`, "hours");
    revalidateTag(`user-followers-${userId}`, "hours");
    revalidateTag(`user-followings-${userId}`, "hours");
    return;
  }

  // Revalidate specific cache tags based on options
  if (options.userData) {
    revalidateTag(`user-data-${userId}`, "hours");
  }

  if (options.passBuyers) {
    revalidateTag(`user-pass-buyers-${userId}`, "hours");
  }

  if (options.followers) {
    revalidateTag(`user-followers-${userId}`, "hours");
  }

  if (options.followings) {
    revalidateTag(`user-followings-${userId}`, "hours");
  }
}

/**
 * Revalidates only the user's basic data cache
 * @param userId - The user ID to revalidate cache for
 */
export async function revalidateUserBasicData(userId: string) {
  if (!userId) {
    throw new Error("User ID is required");
  }
  revalidateTag(`user-data-${userId}`, "hours");
}

/**
 * Revalidates only the user's followers cache
 * @param userId - The user ID to revalidate cache for
 */
export async function revalidateUserFollowers(userId: string) {
  if (!userId) {
    throw new Error("User ID is required");
  }
  revalidateTag(`user-followers-${userId}`, "hours");
}

/**
 * Revalidates only the user's followings cache
 * @param userId - The user ID to revalidate cache for
 */
export async function revalidateUserFollowings(userId: string) {
  if (!userId) {
    throw new Error("User ID is required");
  }
  revalidateTag(`user-followings-${userId}`, "hours");
}

/**
 * Revalidates only the user's pass buyers cache
 * @param userId - The user ID to revalidate cache for
 */
export async function revalidateUserPassBuyers(userId: string) {
  if (!userId) {
    throw new Error("User ID is required");
  }
  revalidateTag(`user-pass-buyers-${userId}`, "hours");
}
