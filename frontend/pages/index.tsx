import type { Liff } from "@line/liff";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { Quest } from "@/components/quest/QuestList";
import SwipeableQuest from "@/components/quest/SwipeableQuest";
import {
  getLiffUserProfile,
  getUserDisplayName,
  getUserAvatar,
  type LiffUserProfile,
} from "@/services/liff.service";

type MockUser = {
  name: string;
  avatarUrl?: string;
  rank: string;
  coins: number;
  todayProgress: number; // percent
  health: number;
  energy: number;
  exp: { current: number; total: number };
};

const mock: MockUser = {
  name: "Lucy",
  avatarUrl: "/img/avatar.png", // optional placeholder
  rank: "Novice",
  coins: 200,
  todayProgress: 68,
  health: 9,
  energy: 8,
  exp: { current: 8, total: 100 },
};

const Home: NextPage<{ liff: Liff | null; liffError: string | null }> = ({
  liff,
}) => {
  const [userProfile, setUserProfile] = useState<LiffUserProfile | null>(null);

  // Fetch user profile when LIFF is ready
  useEffect(() => {
    if (liff) {
      getLiffUserProfile(liff).then((profile: LiffUserProfile | null) => {
        setUserProfile(profile);
      });
    }
  }, [liff]);

  // Use LIFF profile data or fallback to mock data
  const userName = getUserDisplayName(userProfile, mock.name);
  const userAvatar = getUserAvatar(userProfile, mock.avatarUrl);

  const expPercent = Math.min(
    100,
    Math.round((mock.exp.current / mock.exp.total) * 100)
  );
  const quests: Quest[] = [
    {
      id: "sleep",
      title: "SLEEP ENOUGH QUEST",
      description:
        "This week you seem you do not sleep enough. In this quest, you just sleep at least 9 hr.",
      progressPercent: 55,
      progressLabel: "5 / 9 hrs.",
      exp: 5,
      heart: 5,
      energy: 5,
    },
    {
      id: "steps",
      title: "WALK 6,000 STEPS",
      description: "Hit your daily step target to earn rewards.",
      progressPercent: 40,
      progressLabel: "2,400 / 6,000",
      exp: 3,
      heart: 2,
      energy: 4,
    },
    {
      id: "water",
      title: "DRINK 2L WATER",
      description: "Stay hydrated throughout the day.",
      progressPercent: 70,
      progressLabel: "1.4 / 2.0 L",
      exp: 2,
      heart: 1,
      energy: 2,
    },
  ];

  return (
    <div>
      <Head>
        <title>LINE Fit Quest</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="px-4 pt-6 pb-24">
        {/* Header: Avatar left, Greeting & Progress stacked right */}
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <Link
            href="/my-avatar"
            className="relative w-28 h-28 shrink-0 rounded-full grid place-items-center"
          >
            <div className="absolute inset-0 rounded-full ring-4 ring-[#06C755]" />
            {userAvatar ? (
              <img
                src={userAvatar}
                alt="profile"
                className="relative z-10 w-28 h-28 rounded-full object-cover"
              />
            ) : (
              <div className="relative z-10 w-28 h-28 rounded-full bg-gray-300" />
            )}
          </Link>
          {/* Right stack */}
          <div className="flex flex-col gap-3 flex-1">
            <h1 className="text-4xl font-bold text-[#06C755] leading-tight">
              Hello, {userName}
            </h1>
            <Link
              href="/my-avatar"
              className="inline-flex items-center gap-3 rounded-3xl bg-white px-5 py-3 text-black shadow-sm"
            >
              <span className="text-3xl text-[#06C755]">⚡</span>
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-wide">
                  Today Progress
                </span>
                <span className="text-2xl font-bold text-[#06C755]">
                  {mock.todayProgress}%
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Tagline card */}
        <div className="mt-4 rounded-3xl bg-white/90 text-black px-4 py-3">
          <p className="text-center font-semibold">
            Just start moving, and enjoy collecting Gold and Health Savings
            Points!
          </p>
        </div>

        {/* Stats card */}
        <Link
          href="/my-avatar"
          className="mt-6 block rounded-2xl bg-[#2B2C31] text-white border-2 border-black"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center pt-2 pl-5 gap-2">
              <span className="text-2xl">🏆</span>
              <span className="font-semibold tracking-wide">
                RANK {mock.rank}
              </span>
            </div>
            <div className="flex items-center pt-2 pr-5 gap-2">
              <span className="text-yellow-300">🪙</span>
              <span className="font-semibold">{mock.coins}</span>
            </div>
          </div>

          {/* Inner white card with blue border */}
          <div className="mt-4 rounded-2xl bg-white p-4 border-2 border-black">
            <div className="grid grid-cols-2 gap-y-5">
              {/* Left labels */}
              <div className="space-y-5 text-[17px] font-medium text-black pl-2">
                <div>health</div>
                <div>energy</div>
                <div>exp</div>
              </div>
              {/* Right stats */}
              <div className="space-y-5 pr-5">
                <div className="flex items-center justify-end gap-2 text-[17px]">
                  <span className="text-red-500">❤</span>
                  <span className="font-semibold text-black">
                    {mock.health}
                  </span>
                </div>
                <div className="flex items-center justify-end gap-2 text-[17px]">
                  <span className="text-blue-600">⚡</span>
                  <span className="font-semibold text-black">
                    {mock.energy}
                  </span>
                </div>
                <div>
                  <div className="flex items-center justify-end">
                    <span className="rounded-full bg-[#4BD17C]/92 px-3 py-1 text-sm font-semibold">
                      {mock.exp.current} / {mock.exp.total}
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
          </div>
        </Link>

        {/* Quests section */}
        <div className="mt-6 rounded-2xl border-2 border-[#06C755] p-4 bg-white/90 text-black">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">⭐</span>
              <h2 className="text-2xl font-semibold">Quests</h2>
            </div>
            <Link
              href="/quests"
              className="rounded-full border border-black/20 bg-white px-4 py-2 text-sm font-semibold shadow-sm"
            >
              See All →
            </Link>
          </div>

          <SwipeableQuest quests={quests} />
        </div>
      </div>
    </div>
  );
};

export default Home;
