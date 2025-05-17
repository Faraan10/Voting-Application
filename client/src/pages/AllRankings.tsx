import { useQuery } from "@tanstack/react-query";
import RankingItem from "@/components/RankingItem";
import { Park } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function AllRankings() {
  // Fetch all park rankings
  const { data: rankings, isLoading } = useQuery<Park[]>({
    queryKey: ["/api/ranking"],
    refetchOnWindowFocus: false,
  });

  return (
    <div className="pb-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-neutral-800">
          National Park Rankings
        </h1>
        <p className="text-neutral-600 mt-2">
          All national parks ranked by visitor votes using the ELO rating system
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-heading font-bold text-neutral-800">Complete Rankings</h2>
        <div className="flex items-center space-x-4 mt-2 md:mt-0">
          <h3 className="text-xl font-heading font-bold text-neutral-800">score</h3>
          <h3 className="text-xl font-heading font-bold text-neutral-800">change</h3>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading || !rankings ? (
          // Loading state
          <ul className="divide-y divide-neutral-200">
            {[...Array(10)].map((_, index) => (
              <li key={index} className="p-4">
                <Skeleton className="h-8 w-full" />
              </li>
            ))}
          </ul>
        ) : (
          // Render all rankings
          <ul className="divide-y divide-neutral-200">
            {rankings.map((park) => (
              <RankingItem key={park.id} park={park} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
