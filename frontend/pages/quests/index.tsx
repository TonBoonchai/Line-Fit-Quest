import Head from "next/head";
import QuestCard from "@/components/quest/QuestCard";
import { useRouter } from "next/router";
import Link from "next/link";

type Quest = {
  id: string;
  title: string;
  description: string;
  progressPercent: number;
  progressLabel?: string;
  exp: number;
  heart: number;
  energy: number;
};

const mockQuests: Quest[] = [
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
    id: "run",
    title: "RUN QUEST",
    description:
      "Don’t you get running exercise this week yet? In this quest, you just run total 30 minutes.",
    progressPercent: 16,
    progressLabel: "5 / 30 min.",
    exp: 8,
    heart: 10,
    energy: 3,
  },
  {
    id: "detox",
    title: "DETOX QUEST",
    description:
      "Today you have used your phone since morning. In this quest, you just not touch the phone for 30 minutes.",
    progressPercent: 67,
    progressLabel: "20 / 30 min.",
    exp: 8,
    heart: 10,
    energy: 3,
  },
];

export default function QuestPage() {
  const router = useRouter();
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
              src="/img/avatar.png"
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
          {mockQuests.map((q) => (
            <QuestCard
              key={q.id}
              title={q.title}
              description={q.description}
              progressPercent={q.progressPercent}
              progressLabel={q.progressLabel}
              exp={q.exp}
              heart={q.heart}
              energy={q.energy}
            />
          ))}
        </div>
      </div>
    </>
  );
}
