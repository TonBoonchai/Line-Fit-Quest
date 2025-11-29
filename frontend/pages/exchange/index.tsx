import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import type { Liff } from "@line/liff";
import type { NextPage } from "next";
import { getLiffUserProfile, getUserAvatar } from "@/services/liff.service";
import { getLeaderboardApi, type User } from "@/apis/user.api";

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
  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  // Fetch user profile for avatar and leaderboard data
  useEffect(() => {
    const fetchData = async () => {
      if (!liff) return;
      try {
        const profile = await getLiffUserProfile(liff);
        if (profile) {
          setUserAvatar(getUserAvatar(profile));
        }

        // Fetch leaderboard from API
        const users = await getLeaderboardApi(10);
        const formattedUsers: LeaderboardUser[] = users.map((user, index) => ({
          rank: index + 1,
          name: user.displayName,
          exp: user.exp,
          avatar:
            user.pictureUrl ||
            `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.displayName}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
        }));
        setLeaderboardUsers(formattedUsers);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setLoading(false);
      }
    };
    fetchData();
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

  // Use real data if available, otherwise use mock data
  const displayUsers =
    leaderboardUsers.length > 0
      ? leaderboardUsers
      : [...topThree, ...otherUsers];

  // Pad to ensure we always have 10 users for display
  const paddedUsers = [...displayUsers];
  while (paddedUsers.length < 10) {
    paddedUsers.push({
      rank: paddedUsers.length + 1,
      name: "---",
      exp: 0,
      avatar: "",
    });
  }

  const displayTopThree = paddedUsers.slice(0, 3);
  const displayOthers = paddedUsers.slice(3, 10);

  // Reorder top three for podium display: [2nd, 1st, 3rd]
  const podiumOrder =
    displayTopThree.length >= 3
      ? [displayTopThree[1], displayTopThree[0], displayTopThree[2]]
      : displayTopThree;

  return (
    <>
      <Head>
        <title>Leaderboard • Line Fit Quest</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen flex flex-col text-white pt-6">
        {/* Header */}
        <div className="flex items-center mb-6 px-4">
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

        {loading ? (
          <div className="text-center py-8">Loading leaderboard...</div>
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Top 3 Podium */}
            <div className="flex items-end justify-center gap-2 px-10">
              {/* 2nd Place */}
              {podiumOrder[0] && (
                <div className="flex flex-col items-center flex-1">
                  <p className="font-bold text-white text-sm mb-1">
                    {podiumOrder[0].name}
                  </p>
                  <p className="text-xs text-gray-300 mb-2">
                    {podiumOrder[0].exp} exp
                  </p>
                  <div className="bg-[#B9B9B9] rounded-t-lg w-full h-40 flex flex-col items-center justify-center gap-2 pt-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-white bg-gray-300">
                      {podiumOrder[0].avatar ? (
                        <img
                          src={podiumOrder[0].avatar}
                          alt={podiumOrder[0].name}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>
                    <span className="text-3xl font-bold text-black">2</span>
                  </div>
                </div>
              )}

              {/* 1st Place */}
              {podiumOrder[1] && (
                <div className="flex flex-col items-center flex-1">
                  <p className="font-bold text-red-500 text-sm mb-1">
                    {podiumOrder[1].name}
                  </p>
                  <p className="text-xs text-gray-300 mb-2">
                    {podiumOrder[1].exp} exp
                  </p>
                  <div className="bg-[#FFD700] rounded-t-lg w-full h-48 flex flex-col items-center justify-center gap-2 pt-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-white bg-gray-300">
                      {podiumOrder[1].avatar ? (
                        <img
                          src={podiumOrder[1].avatar}
                          alt={podiumOrder[1].name}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>
                    <span className="text-4xl font-bold text-black">1</span>
                  </div>
                </div>
              )}

              {/* 3rd Place */}
              {podiumOrder[2] && (
                <div className="flex flex-col items-center flex-1">
                  <p className="font-bold text-white text-sm mb-1">
                    {podiumOrder[2].name}
                  </p>
                  <p className="text-xs text-gray-300 mb-2">
                    {podiumOrder[2].exp} exp
                  </p>
                  <div className="bg-[#CD7F32] rounded-t-lg w-full h-32 flex flex-col items-center justify-center gap-2 pt-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden ring-4 ring-white bg-gray-300">
                      {podiumOrder[2].avatar ? (
                        <img
                          src={podiumOrder[2].avatar}
                          alt={podiumOrder[2].name}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>
                    <span className="text-2xl font-bold text-black">3</span>
                  </div>
                </div>
              )}
            </div>

            {/* Rank 4-10 */}
            <div className="flex-1 px-4 pb-24 flex flex-col">
              <div className="bg-white rounded-3xl px-4 pt-4 pb-6 flex-1">
                {displayOthers.map((user) => (
                  <div
                    key={user.rank}
                    className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bold text-gray-800 w-8">
                        {String(user.rank).padStart(2, "0")}
                      </span>
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : null}
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
          </div>
        )}
      </div>
    </>
  );
};

export default LeaderboardPage;
