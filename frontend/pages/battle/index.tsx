import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import type { Liff } from "@line/liff";
import type { NextPage } from "next";
import { getLiffUserProfile, getUserAvatar } from "@/services/liff.service";

type BattleUser = {
  name: string;
  exp: number;
  avatar: string;
};

const BattlePage: NextPage<{ liff: Liff | null; liffError: string | null }> = ({
  liff,
}) => {
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

  // Mock battle data - current rankings
  const battleUsers: BattleUser[] = [
    {
      name: "Lucky",
      exp: 100,
      avatar:
        "https://api.dicebear.com/7.x/pixel-art/svg?seed=Lucky&backgroundColor=b6e3f4,c0aede,d1d4f9",
    },
    {
      name: "Pual",
      exp: 80,
      avatar:
        "https://api.dicebear.com/7.x/pixel-art/svg?seed=Pual&backgroundColor=b6e3f4,c0aede,d1d4f9",
    },
    {
      name: "Mini",
      exp: 60,
      avatar:
        "https://api.dicebear.com/7.x/pixel-art/svg?seed=Mini&backgroundColor=b6e3f4,c0aede,d1d4f9",
    },
    {
      name: "ABC",
      exp: 40,
      avatar:
        "https://api.dicebear.com/7.x/pixel-art/svg?seed=ABC&backgroundColor=b6e3f4,c0aede,d1d4f9",
    },
  ];

  return (
    <>
      <Head>
        <title>Battle • Line Fit Quest</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen text-white px-4 pt-6 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            aria-label="Back"
            className="text-white text-2xl"
            onClick={() => router.back()}
          >
            ←
          </button>
          <div className="w-10 h-10 rounded-full ring-2 ring-white overflow-hidden">
            <img
              src={userAvatar}
              alt="avatar"
              className="w-10 h-10 object-cover"
            />
          </div>
        </div>

        <div className="bg-[#2B2828]/80 px-5 py-4 rounded-3xl">
          {/* Title */}
          <h1 className="text-3xl font-bold mb-4 text-center">
            Now in progress
          </h1>

          {/* Battle Rankings */}
          <div className="space-y-3 mb-6">
            {battleUsers.map((user, index) => (
              <div
                key={index}
                className="bg-white rounded-full flex items-center px-4 py-3 shadow-lg"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-bold text-black text-lg flex-1">
                  {user.name}
                </span>
                <span
                  className={`font-bold text-lg pr-4 ${
                    index === 0 ? "text-[#D40A0A]" : "text-black"
                  }`}
                >
                  +{user.exp} exp
                </span>
              </div>
            ))}
          </div>

          {/* Footer Text */}
          <p className="text-center text-white text-sm">
            In one week, the final chapter closes
          </p>
        </div>

        {/* Invite Button */}
        <div className="flex justify-center">
          <button className="w-[40%] bg-white text-[#06C755] font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg my-10">
            <span className="text-xl">✉️</span>
            <span>Invite friends</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default BattlePage;
