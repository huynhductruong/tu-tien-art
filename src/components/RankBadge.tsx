import { cn } from "@/lib/utils";
import { rankLabels, type RealmRank } from "@/data/cultivation";

const rankClasses: Record<RealmRank, string> = {
  common: "bg-rank-common/10 text-rank-common border-rank-common/30",
  uncommon: "bg-rank-uncommon/10 text-rank-uncommon border-rank-uncommon/30",
  rare: "bg-rank-rare/10 text-rank-rare border-rank-rare/30",
  epic: "bg-rank-epic/10 text-rank-epic border-rank-epic/30",
  legend: "bg-rank-legend/10 text-rank-legend border-rank-legend/40",
  myth: "bg-rank-myth/10 text-rank-myth border-rank-myth/40",
};

export const RankBadge = ({ rank, className }: { rank: RealmRank; className?: string }) => (
  <span
    className={cn(
      "inline-flex items-center px-2.5 py-1 text-xs font-display tracking-widest uppercase border rounded-sm",
      rankClasses[rank],
      className,
    )}
  >
    {rankLabels[rank]}
  </span>
);
