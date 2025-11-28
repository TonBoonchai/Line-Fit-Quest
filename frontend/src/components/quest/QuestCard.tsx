import React from "react";

export type QuestCardProps = {
  title: string;
  description: string;
  progressPercent: number; // 0-100
  progressLabel?: string; // e.g. "5 / 9 hrs."
  exp: number;
  heart: number;
  energy: number;
  className?: string;
};

export default function QuestCard({
  title,
  description,
  progressPercent,
  progressLabel,
  exp,
  heart,
  energy,
  className = "",
}: QuestCardProps) {
  const pct = Math.max(0, Math.min(100, Math.round(progressPercent)));

  return (
    <div className={`mt-4 rounded-2xl overflow-hidden ${className}`}>
      <div className="bg-[#06C755] text-white text-center py-3 font-semibold tracking-wide">
        {title}
      </div>
      <div className="bg-white p-4 text-black">
        <div className="text-sm">
          <p className="font-semibold">Progress :</p>
          <p className="mt-2 text-gray-700">{description}</p>
        </div>
        <div className="mt-4">
          <div className="relative h-6 w-full rounded-full bg-gray-300">
            <div
              className="absolute left-0 top-0 h-6 rounded-full bg-[#5587D7]"
              style={{ width: `${pct}%` }}
            />
            {progressLabel && (
              <div className="absolute right-2 top-0 h-6 text-xs flex items-center text-black">
                <span className="ml-2">{progressLabel}</span>
              </div>
            )}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-4 text-sm">
          <span className="text-gray-700">+ {exp} EXP</span>
          <span className="flex items-center gap-1">
            <span className="text-red-500">❤</span>
            {heart}
          </span>
          <span className="flex items-center gap-1">
            <span className="text-blue-500">⚡</span>
            {energy}
          </span>
          <span className="ml-auto text-gray-500">↩︎</span>
        </div>
      </div>
    </div>
  );
}
