import type { Liff } from "@line/liff";

export interface LiffUserProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

/**
 * Get the LINE user profile from LIFF
 * @param liff - The initialized LIFF object
 * @returns User profile data or null if not available
 */
export async function getLiffUserProfile(
  liff: Liff | null
): Promise<LiffUserProfile | null> {
  if (!liff) {
    console.warn("LIFF is not initialized");
    return null;
  }

  if (!liff.isLoggedIn()) {
    console.warn("User is not logged in to LINE");
    return null;
  }

  try {
    const profile = await liff.getProfile();
    return {
      userId: profile.userId,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl,
      statusMessage: profile.statusMessage,
    };
  } catch (error) {
    console.error("Failed to get LIFF profile:", error);
    return null;
  }
}

/**
 * Get user's display name or fallback to default
 */
export function getUserDisplayName(
  profile: LiffUserProfile | null,
  fallback: string = "Guest"
): string {
  return profile?.displayName || fallback;
}

/**
 * Get user's avatar URL or fallback to default
 */
export function getUserAvatar(
  profile: LiffUserProfile | null,
  fallback: string = "/img/avatar.png"
): string {
  return profile?.pictureUrl || fallback;
}
