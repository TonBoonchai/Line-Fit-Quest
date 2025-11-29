import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import type { Liff } from "@line/liff";
import type { NextPage } from "next";
import { getLiffUserProfile, getUserAvatar } from "@/services/liff.service";

type LeaderboardUser = {
  rank: number;
  name: string;
  exp: number;
  avatar: string;
  trend?: "up" | "down" | "same";
};

const LeaderboardPage: NextPage<{
  liff: Liff | null;
  liffError: string | null;
}> = ({ liff }) => {
  const router = useRouter();
  const [userAvatar, setUserAvatar] = useState<string>("/img/avatar.png");

  // Fetch user profile for avatar
  useEffect(() => {
    const fetchProfile = async () => {
      if (!liff) return;
      try {
        const profile = await getLiffUserProfile(liff);
        if (profile) {
          setUserAvatar(getUserAvatar(profile));
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchProfile();
  }, [liff]);

  // Mock leaderboard data
  const topThree: LeaderboardUser[] = [
    {
      rank: 2,
      name: "Mini",
      exp: 200,
      avatar:
        "https://api.dicebear.com/7.x/pixel-art/svg?seed=Mini&backgroundColor=b6e3f4,c0aede,d1d4f9",
    },
    {
      rank: 1,
      name: "Lucky",
      exp: 300,
      avatar:
        "https://api.dicebear.com/7.x/pixel-art/svg?seed=Lucky&backgroundColor=b6e3f4,c0aede,d1d4f9",
    },
    {
      rank: 3,
      name: "ABC",
      exp: 280,
      avatar:
        "https://api.dicebear.com/7.x/pixel-art/svg?seed=ABC&backgroundColor=b6e3f4,c0aede,d1d4f9",
    },
  ];

  const otherUsers: LeaderboardUser[] = [
    {
      rank: 4,
      name: "Yve",
      exp: 144,
      avatar:
        "https://api.dicebear.com/7.x/pixel-art/svg?seed=Yve&backgroundColor=b6e3f4,c0aede,d1d4f9",
      trend: "up",
    },
    {
      rank: 5,
      name: "Rora",
      exp: 140,
      avatar:
        "https://api.dicebear.com/7.x/pixel-art/svg?seed=Rora&backgroundColor=b6e3f4,c0aede,d1d4f9",
      trend: "up",
    },
    {
      rank: 6,
      name: "Fiona",
      exp: 132,
      avatar:
        "https://api.dicebear.com/7.x/pixel-art/svg?seed=Fiona&backgroundColor=b6e3f4,c0aede,d1d4f9",
      trend: "down",
    },
    {
      rank: 7,
      name: "Lila",
      exp: 124,
      avatar:
        "https://api.dicebear.com/7.x/pixel-art/svg?seed=Lila&backgroundColor=b6e3f4,c0aede,d1d4f9",
      trend: "down",
    },
    {
      rank: 8,
      name: "Love",
      exp: 113,
      avatar:
        "https://api.dicebear.com/7.x/pixel-art/svg?seed=Love&backgroundColor=b6e3f4,c0aede,d1d4f9",
      trend: "up",
    },
    {
      rank: 9,
      name: "Emma",
      exp: 108,
      avatar:
        "https://api.dicebear.com/7.x/pixel-art/svg?seed=Emma&backgroundColor=b6e3f4,c0aede,d1d4f9",
      trend: "up",
    },
    {
      rank: 10,
      name: "Noah",
      exp: 102,
      avatar:
        "https://api.dicebear.com/7.x/pixel-art/svg?seed=Noah&backgroundColor=b6e3f4,c0aede,d1d4f9",
      trend: "up",
    },
  ];

  return (
    <>
      <Head>
        <title>Leaderboard • Line Fit Quest</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen text-white pt-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            aria-label="Back"
            className="text-white text-2xl mr-4"
            onClick={() => router.back()}
          >
            ←
          </button>
          <h1 className="text-4xl font-extrabold tracking-widest">
            LEADERBOARD
          </h1>
        </div>

        {/* Top 3 Podium */}
        <div className="flex items-end justify-center gap-2 px-10">
          {/* 2nd Place */}
          <div className="flex flex-col items-center flex-1">
            <p className="font-bold text-white text-sm mb-1">
              {topThree[0].name}
            </p>
            <p className="text-xs text-gray-300 mb-2">{topThree[0].exp} exp</p>
            <div className="bg-[#B9B9B9] rounded-t-lg w-full h-40 flex flex-col items-center justify-center gap-2 pt-4">
              <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-white">
                <img
                  src={topThree[0].avatar}
                  alt={topThree[0].name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-3xl font-bold text-white">2</span>
            </div>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center flex-1">
            <p className="font-bold text-white mb-1">{topThree[1].name}</p>
            <p className="text-xs text-gray-300 mb-2">{topThree[1].exp} exp</p>
            <div className="bg-[#FFE993] rounded-t-lg w-full h-48 flex flex-col items-center justify-center gap-2 pt-4">
              <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-white">
                <img
                  src={topThree[1].avatar}
                  alt={topThree[1].name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-4xl font-bold text-black">1</span>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center flex-1">
            <p className="font-bold text-white text-sm mb-1">
              {topThree[2].name}
            </p>
            <p className="text-xs text-gray-300 mb-2">{topThree[2].exp} exp</p>
            <div className="bg-[#BA7E76] rounded-t-lg w-full h-32 flex flex-col items-center justify-center gap-2 pt-4">
              <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-white">
                <img
                  src={topThree[2].avatar}
                  alt={topThree[2].name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-2xl font-bold text-white">3</span>
            </div>
          </div>
        </div>

        {/* Rest of Leaderboard */}
        <div className="bg-white rounded-t-3xl px-4 pt-4 pb-6">
          {otherUsers.map((user) => (
            <div
              key={user.rank}
              className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-gray-800 w-8">
                  {String(user.rank).padStart(2, "0")}
                </span>
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-black">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.exp}exp</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default LeaderboardPage;
