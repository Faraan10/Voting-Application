import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import ParkCard from "@/components/ParkCard";
import VersusCircle from "@/components/VersusCircle";
import RankingItem from "@/components/RankingItem";
import { Park } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [matchupKey, setMatchupKey] = useState(0);

  // Fetch a random matchup
  const { data: matchup, isLoading: isLoadingMatchup } = useQuery<{ park1: Park; park2: Park }>({
    queryKey: ["/api/matchup", matchupKey],
    refetchOnWindowFocus: false,
  });

  // Fetch top rankings
  const { data: topRankings, isLoading: isLoadingRankings } = useQuery<Park[]>({
    queryKey: ["/api/ranking"],
    refetchOnWindowFocus: false,
  });

  // Function to get a new matchup
  const getNewMatchup = () => {
    setMatchupKey(prev => prev + 1);
  };

  return (
    <>
      {/* Voting Section */}
      <section className="mb-10">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-neutral-800">
            Which park would you rather visit?
          </h2>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {isLoadingMatchup || !matchup ? (
            // Loading state for matchup
            <>
              <div className="w-full md:w-5/12">
                <Skeleton className="h-72 w-full rounded-lg" />
              </div>
              <div className="flex-shrink-0">
                <Skeleton className="h-16 w-16 rounded-full" />
              </div>
              <div className="w-full md:w-5/12">
                <Skeleton className="h-72 w-full rounded-lg" />
              </div>
            </>
          ) : (
            // Render park cards when data is available
            <>
              <ParkCard 
                park={matchup.park1} 
                opponent={matchup.park2}
                onVote={getNewMatchup}
              />
              <VersusCircle />
              <ParkCard 
                park={matchup.park2} 
                opponent={matchup.park1}
                onVote={getNewMatchup}
              />
            </>
          )}
        </div>
      </section>

      {/* Rankings Section */}
      <section>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-heading font-bold text-neutral-800">rankings</h2>
          <div className="flex items-center space-x-4 mt-2 md:mt-0">
            <h3 className="text-xl font-heading font-bold text-neutral-800">score</h3>
            <h3 className="text-xl font-heading font-bold text-neutral-800">change</h3>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {isLoadingRankings || !topRankings ? (
            // Loading state for rankings
            <ul className="divide-y divide-neutral-200">
              {[...Array(4)].map((_, index) => (
                <li key={index} className="p-4">
                  <Skeleton className="h-8 w-full" />
                </li>
              ))}
            </ul>
          ) : (
            // Render ranking items when data is available
            <ul className="divide-y divide-neutral-200">
              {topRankings.slice(0, 10).map((park) => (
                <RankingItem
                  key={park.id}
                  park={park}
                  highlightCurrent={
                    matchup && (park.id === matchup.park1.id || park.id === matchup.park2.id)
                  }
                />
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4 text-center">
          <Link href="/rankings">
            <Button className="bg-neutral-200 hover:bg-neutral-300 text-neutral-700 font-semibold py-2 px-4 rounded-md transition">
              View All Rankings
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
