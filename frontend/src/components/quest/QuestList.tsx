import React from "react";
import QuestCard, { QuestCardProps } from "./QuestCard";

export type Quest = QuestCardProps & { id: string };

type QuestListProps = {
  quests: Quest[];
  className?: string;
};

export default function QuestList({ quests, className = "" }: QuestListProps) {
  return (
    <div className={className}>
      {quests.map((q) => (
        <QuestCard key={q.id} {...q} />
      ))}
    </div>
  );
}
