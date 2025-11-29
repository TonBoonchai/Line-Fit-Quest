import Head from "next/head";
import QuestCard from "@/components/quest/QuestCard";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { Liff } from "@line/liff";
import type { NextPage } from "next";
import { getUserQuestsApi } from "@/apis/quest.api";
import { getLiffUserProfile, getUserAvatar } from "@/services/liff.service";
import type { Quest } from "@/types/quest.type";

const QuestPage: NextPage<{ liff: Liff | null; liffError: string | null }> = ({
  liff,
}) => {
  const router = useRouter();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [userAvatar, setUserAvatar] = useState<string>("/img/avatar.png");

  // Fetch quests when LIFF is ready
  useEffect(() => {
    const fetchQuests = async () => {
      if (!liff) {
        setLoading(false);
        return;
      }

      try {
        const profile = await getLiffUserProfile(liff);
        if (profile) {
          setUserAvatar(getUserAvatar(profile));
          // Use LINE userId directly as string
          const fetchedQuests = await getUserQuestsApi(profile.userId);
          setQuests(fetchedQuests);
        }
      } catch (error) {
        console.error("Failed to fetch quests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuests();
  }, [liff]);

  return (
    <>
      <Head>
        <title>Quests • Line Fit Quest</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen text-white px-4 pt-6 pb-24 relative">
        {/* Header row: back, title, avatar */}
        <div className="flex items-center justify-between">
          <button
            aria-label="Back"
            className="text-white text-2xl"
            onClick={() => router.back()}
          >
            ←
          </button>
          <h1 className="text-4xl font-extrabold tracking-widest">QUESTS</h1>
          <div className="w-10 h-10 rounded-full ring-2 ring-white overflow-hidden">
            <img
              src={userAvatar}
              alt="avatar"
              className="w-10 h-10 object-cover"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Link
            href="/quests/new"
            className="rounded-xl bg-[#E1B446] text-white font-bold py-3 shadow text-center"
          >
            + QUEST
          </Link>
          <Link
            href="/battle"
            className="rounded-xl bg-[#E60000] text-white font-bold py-3 shadow text-center"
          >
            ⚔️ BATTLE WITH FRIENDS
          </Link>
        </div>

        {/* List of quests */}
        <div className="mt-4">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-lg">Loading quests...</p>
            </div>
          ) : quests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg">No quests available</p>
            </div>
          ) : (
            quests.map((q) => {
              const progressPercent =
                q.goal > 0 ? (q.progress / q.goal) * 100 : 0;
              const progressLabel = `${q.progress} / ${q.goal}`;
              return (
                <QuestCard
                  key={q.id}
                  title={q.title}
                  description={q.description}
                  progressPercent={progressPercent}
                  progressLabel={progressLabel}
                  exp={q.expPoints}
                  heart={q.healthPoints}
                  energy={q.energyPoints}
                />
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default QuestPage;
