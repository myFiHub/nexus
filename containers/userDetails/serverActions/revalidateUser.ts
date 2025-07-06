"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function revalidateUserProfile(userId: string) {
  revalidatePath(`/user/${userId}`);
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
    revalidateTag(`user-data-${userId}`);
    revalidateTag(`user-pass-buyers-${userId}`);
    revalidateTag(`user-followers-${userId}`);
    revalidateTag(`user-followings-${userId}`);
    return;
  }

  // Revalidate specific cache tags based on options
  if (options.userData) {
    revalidateTag(`user-data-${userId}`);
  }

  if (options.passBuyers) {
    revalidateTag(`user-pass-buyers-${userId}`);
  }

  if (options.followers) {
    revalidateTag(`user-followers-${userId}`);
  }

  if (options.followings) {
    revalidateTag(`user-followings-${userId}`);
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
  revalidateTag(`user-data-${userId}`);
}

/**
 * Revalidates only the user's followers cache
 * @param userId - The user ID to revalidate cache for
 */
export async function revalidateUserFollowers(userId: string) {
  if (!userId) {
    throw new Error("User ID is required");
  }
  revalidateTag(`user-followers-${userId}`);
}

/**
 * Revalidates only the user's followings cache
 * @param userId - The user ID to revalidate cache for
 */
export async function revalidateUserFollowings(userId: string) {
  if (!userId) {
    throw new Error("User ID is required");
  }
  revalidateTag(`user-followings-${userId}`);
}

/**
 * Revalidates only the user's pass buyers cache
 * @param userId - The user ID to revalidate cache for
 */
export async function revalidateUserPassBuyers(userId: string) {
  if (!userId) {
    throw new Error("User ID is required");
  }
  revalidateTag(`user-pass-buyers-${userId}`);
}
