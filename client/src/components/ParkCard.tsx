import { Park } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ParkCardProps {
  park: Park;
  opponent: Park;
  onVote: () => void;
}

export default function ParkCard({ park, opponent, onVote }: ParkCardProps) {
  const queryClient = useQueryClient();
  const [isVoting, setIsVoting] = useState(false);
  const { toast } = useToast();

  const handleVote = async () => {
    setIsVoting(true);
    try {
      await apiRequest("POST", "/api/vote", {
        winnerId: park.id,
        loserId: opponent.id
      });
      
      toast({
        title: "Vote recorded",
        description: `You voted for ${park.name}`,
      });
      
      // Invalidate queries to fetch updated data
      queryClient.invalidateQueries({ queryKey: ["/api/parks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/ranking"] });
      queryClient.invalidateQueries({ queryKey: ["/api/matchup"] });
      
      // Trigger the parent component to load a new matchup
      onVote();
    } catch (error) {
      toast({
        title: "Error recording vote",
        description: "There was a problem recording your vote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVoting(false);
    }
  };

  // Determine icon class based on park name
  let iconClass = "fas fa-mountain";
  if (park.name.toLowerCase().includes("forest") || park.name.toLowerCase().includes("tree")) {
    iconClass = "fas fa-tree";
  } else if (park.name.toLowerCase().includes("lake")) {
    iconClass = "fas fa-water";
  } else if (park.name.toLowerCase().includes("island")) {
    iconClass = "fas fa-island-tropical";
  } else if (park.name.toLowerCase().includes("smoky")) {
    iconClass = "fas fa-leaf";
  }

  return (
    <div className="park-card bg-white rounded-lg shadow-md p-4 w-full md:w-5/12 transition-transform hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start mb-2">
        <i className={cn(iconClass, "text-[#4CAF50] text-xl mr-2")}></i>
        <h3 className="text-xl font-heading font-bold">{park.name}</h3>
      </div>
      
      <img 
        src={park.imageUrl} 
        alt={`${park.name} National Park`} 
        className="w-full h-48 object-cover rounded-md mb-3"
      />
      
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-block px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs font-semibold">
          {park.state}
        </span>
        <span className="inline-block px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs font-semibold">
          rank #{park.rank}
        </span>
      </div>
      
      <p className="text-sm text-neutral-600 mb-4 line-clamp-3">
        {park.description}
      </p>
      
      <Button 
        className="vote-button w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold py-2 px-4 rounded-md transition hover:scale-105 active:scale-95"
        onClick={handleVote}
        disabled={isVoting}
      >
        {isVoting ? (
          <>
            <i className="fas fa-spinner fa-spin mr-2"></i> Voting...
          </>
        ) : (
          <>Vote for this park</>
        )}
      </Button>
    </div>
  );
}
