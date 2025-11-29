import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import type { Liff } from "@line/liff";
import type { NextPage } from "next";
import {
  getLiffUserProfile,
  getUserDisplayName,
  getUserAvatar,
  type LiffUserProfile,
} from "@/services/liff.service";
import { initUserApi, getUserApi, type User } from "@/apis/user.api";

const MyAvatarPage: NextPage<{
  liff: Liff | null;
  liffError: string | null;
}> = ({ liff }) => {
  const [userProfile, setUserProfile] = useState<LiffUserProfile | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile and data when LIFF is ready
  useEffect(() => {
    const fetchData = async () => {
      if (!liff) return;

      setIsLoading(true);
      try {
        const profile = await getLiffUserProfile(liff);
        setUserProfile(profile);

        if (profile?.userId) {
          // Initialize or get user data from backend
          const user = await initUserApi(
            profile.userId,
            profile.displayName || "User",
            profile.pictureUrl
          );
          setUserData(user);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [liff]);

  // Use LIFF profile data
  const userName = getUserDisplayName(userProfile, "User");
  const userAvatar = getUserAvatar(userProfile, "/img/avatar.png");

  // Calculate exp percentage
  const expPercent = userData
    ? Math.min(100, Math.round((userData.exp / userData.nextLevelExp) * 100))
    : 0;

  const router = useRouter();
  return (
    <>
      <Head>
        <title>My Avatar • Line Fit Quest</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen px-4 pt-6 pb-24">
        {/* Top bar with title and back button */}
        <div className="grid grid-cols-3 items-center">
          <div className="flex">
            <button
              aria-label="Back"
              className="text-white text-2xl"
              onClick={() => router.back()}
            >
              ←
            </button>
          </div>
          <h1 className="text-4xl text-white font-extrabold tracking-widest text-center">
            MY AVATAR
          </h1>
          <div />
        </div>

        {/* Rank card */}
        <div className="mt-4 rounded-3xl overflow-hidden shadow">
          <div className="bg-[#06C755] text-white flex items-center justify-between px-4 py-3">
            <span className="font-semibold">RANK Novice</span>
          </div>
          <div className="bg-white text-black p-4">
            {isLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <div className="grid grid-cols-2 gap-y-5">
                {/* Labels */}
                <div className="space-y-5 text-[17px] font-medium pl-2">
                  <div>health</div>
                  <div>energy</div>
                  <div>exp</div>
                </div>
                {/* Stats */}
                <div className="space-y-5 pr-5">
                  <div className="flex items-center justify-end gap-2 text-[17px]">
                    <span className="text-red-500">❤</span>
                    <span className="font-semibold">
                      {userData?.health || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-2 text-[17px]">
                    <span className="text-blue-600">⚡</span>
                    <span className="font-semibold">
                      {userData?.energy || 0}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center justify-end">
                      <span className="rounded-full bg-[#4BD17C]/92 px-3 py-1 text-sm font-semibold">
                        {userData?.exp || 0} / {userData?.nextLevelExp || 100}
                      </span>
                    </div>
                    <div className="mt-2 h-4 w-full rounded-full bg-gray-300">
                      <div
                        className="h-4 rounded-full bg-[#4BD17C]/92"
                        style={{ width: `${expPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Big avatar image */}
        <div className="mt-6 w-full flex justify-center">
          <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full ring-3 ring-black overflow-hidden bg-white">
            <img
              src={userAvatar}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Tagline card */}
        <div className="mt-6 rounded-[2rem] bg-white/90 text-black px-6 py-6">
          <p className="text-center font-semibold">
            Just start moving, and enjoy collecting Gold and Health Savings
            Points!
          </p>
        </div>
      </div>
    </>
  );
};

export default MyAvatarPage;
