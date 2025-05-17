import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVoteSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { calculateElo } from "../client/src/lib/elo";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize the database with seed data
  await storage.seedParks();

  // Get all parks
  app.get("/api/parks", async (req, res) => {
    try {
      const parks = await storage.getAllParks();
      res.json(parks);
    } catch (error) {
      res.status(500).json({ message: "Error fetching parks" });
    }
  });

  // Get park by ID
  app.get("/api/parks/:id", async (req, res) => {
    try {
      const parkId = parseInt(req.params.id);
      if (isNaN(parkId)) {
        return res.status(400).json({ message: "Invalid park ID" });
      }

      const park = await storage.getParkById(parkId);
      if (!park) {
        return res.status(404).json({ message: "Park not found" });
      }

      res.json(park);
    } catch (error) {
      res.status(500).json({ message: "Error fetching park" });
    }
  });

  // Get random matchup for voting
  app.get("/api/matchup", async (req, res) => {
    try {
      const matchup = await storage.getRandomMatchup();
      res.json(matchup);
    } catch (error) {
      res.status(500).json({ message: "Error creating matchup" });
    }
  });

  // Get rankings
  app.get("/api/ranking", async (req, res) => {
    try {
      const rankings = await storage.getRankings();
      res.json(rankings);
    } catch (error) {
      res.status(500).json({ message: "Error fetching rankings" });
    }
  });

  // Submit a vote
  app.post("/api/vote", async (req, res) => {
    try {
      console.log("Vote request received:", req.body);
      
      // Validate request body
      const voteData = {
        winnerId: parseInt(req.body.winnerId),
        loserId: parseInt(req.body.loserId),
        winnerEloBefore: 0,
        loserEloBefore: 0,
        winnerEloAfter: 0,
        loserEloAfter: 0
      };
      
      // Get the parks involved in the vote
      const winner = await storage.getParkById(voteData.winnerId);
      const loser = await storage.getParkById(voteData.loserId);
      
      if (!winner || !loser) {
        return res.status(404).json({ message: "One or both parks not found" });
      }
      
      // Calculate new ELO ratings
      const { winnerNewRating, loserNewRating } = calculateElo(
        winner.elo,
        loser.elo,
        32 // K-factor
      );
      
      // Prepare vote record
      const vote = {
        winnerId: winner.id,
        loserId: loser.id,
        winnerEloBefore: winner.elo,
        loserEloBefore: loser.elo,
        winnerEloAfter: winnerNewRating,
        loserEloAfter: loserNewRating,
      };
      
      // Save the vote
      await storage.createVote(vote);
      
      // Update park ELO ratings
      await storage.updateParkElo(winner.id, winnerNewRating, winner.rank);
      await storage.updateParkElo(loser.id, loserNewRating, loser.rank);
      
      // Update rankings
      const updatedRankings = await storage.getRankings();
      
      // Update all ranks based on new ELO scores
      for (let i = 0; i < updatedRankings.length; i++) {
        const park = updatedRankings[i];
        if (park.rank !== i + 1) {
          await storage.updateParkElo(park.id, park.elo, i + 1);
        }
      }
      
      res.status(201).json({ 
        message: "Vote recorded successfully",
        winnerNewRating,
        loserNewRating
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      res.status(500).json({ message: "Error recording vote" });
    }
  });

  // Get recent votes
  app.get("/api/votes/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const recentVotes = await storage.getRecentVotes(limit);
      res.json(recentVotes);
    } catch (error) {
      res.status(500).json({ message: "Error fetching recent votes" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
