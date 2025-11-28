import React, { useRef, useState } from "react";
import QuestCard from "./QuestCard";
import type { Quest } from "./QuestList";

type Props = {
  quests: Quest[];
  className?: string;
  dotClassName?: string;
};

export default function SwipeableQuest({
  quests,
  className = "select-none",
  dotClassName = "mt-4 flex justify-center gap-3",
}: Props) {
  const [qIndex, setQIndex] = useState(0);
  const startX = useRef<number | null>(null);
  const deltaX = useRef(0);

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    deltaX.current = 0;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    deltaX.current = e.touches[0].clientX - startX.current;
  };

  const onTouchEnd = () => {
    const threshold = 48;
    if (deltaX.current <= -threshold && qIndex < quests.length - 1) {
      setQIndex((i) => i + 1);
    } else if (deltaX.current >= threshold && qIndex > 0) {
      setQIndex((i) => i - 1);
    }
    startX.current = null;
    deltaX.current = 0;
  };

  const q = quests[qIndex];

  return (
    <>
      <div
        className={className}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
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
      </div>
      <div className={dotClassName}>
        {quests.map((_, i) => (
          <span
            key={i}
            className={
              "size-3 rounded-full transition-colors " +
              (i === qIndex ? "bg-black" : "border border-black/40")
            }
          />
        ))}
      </div>
    </>
  );
}
