import { Park } from "@shared/schema";
import { cn } from "@/lib/utils";

interface RankingItemProps {
  park: Park;
  highlightCurrent?: boolean;
}

export default function RankingItem({ park, highlightCurrent = false }: RankingItemProps) {
  // Determine change in ranking
  let changeIcon = "— 0";
  let changeClass = "rank-same";
  
  if (park.previousRank && park.rank < park.previousRank) {
    changeIcon = `↑ ${park.previousRank - park.rank}`;
    changeClass = "text-[#4CAF50]";
  } else if (park.previousRank && park.rank > park.previousRank) {
    changeIcon = `↓ ${park.rank - park.previousRank}`;
    changeClass = "text-[#F44336]";
  }

  // Determine icon class based on park name or icon
  let iconClass = "fas fa-mountain";
  if (park.icon) {
    iconClass = park.icon;
  } else {
    if (park.name.toLowerCase().includes("forest") || park.name.toLowerCase().includes("tree")) {
      iconClass = "fas fa-tree";
    } else if (park.name.toLowerCase().includes("lake")) {
      iconClass = "fas fa-water";
    } else if (park.name.toLowerCase().includes("island")) {
      iconClass = "fas fa-island-tropical";
    } else if (park.name.toLowerCase().includes("smoky")) {
      iconClass = "fas fa-leaf";
    }
  }

  const iconColorClass = iconClass.includes("tree") || iconClass.includes("leaf") 
    ? "text-[#4CAF50]" 
    : "text-[#A1887F]";

  return (
    <li className={cn(
      "p-4 hover:bg-neutral-50 transition-colors",
      highlightCurrent && "bg-neutral-100"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="font-heading font-bold text-lg w-8">{park.rank}</span>
          <i className={cn(iconClass, iconColorClass, "text-xl mx-2")}></i>
          <span className="font-semibold">{park.name}</span>
        </div>
        <div className="flex items-center space-x-8">
          <span className="font-mono font-medium text-right w-16">{park.elo}</span>
          <span className={cn(changeClass, "font-medium w-10 text-right")}>{changeIcon}</span>
        </div>
      </div>
    </li>
  );
}
