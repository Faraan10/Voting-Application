import { users, type User, type InsertUser, Park, InsertPark, parks, Vote, InsertVote, votes } from "@shared/schema";
import { nationalParks } from "../client/src/lib/parks-data";
import { calculateElo } from "../client/src/lib/elo";

// Interface for all storage CRUD operations
export interface IStorage {
  // User operations (keeping original functions)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Park operations
  getAllParks(): Promise<Park[]>;
  getParkById(id: number): Promise<Park | undefined>;
  getRandomMatchup(): Promise<{ park1: Park; park2: Park }>;
  createPark(park: InsertPark): Promise<Park>;
  updateParkElo(id: number, newElo: number, newRank: number): Promise<Park>;
  getRankings(): Promise<Park[]>;
  
  // Vote operations
  createVote(vote: InsertVote): Promise<Vote>;
  getRecentVotes(limit: number): Promise<Vote[]>;
  
  // Initialization function
  seedParks(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private parks: Map<number, Park>;
  private votes: Map<number, Vote>;
  currentUserId: number;
  currentParkId: number;
  currentVoteId: number;

  constructor() {
    this.users = new Map();
    this.parks = new Map();
    this.votes = new Map();
    this.currentUserId = 1;
    this.currentParkId = 1;
    this.currentVoteId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Park operations
  async getAllParks(): Promise<Park[]> {
    return Array.from(this.parks.values());
  }

  async getParkById(id: number): Promise<Park | undefined> {
    return this.parks.get(id);
  }

  async getRandomMatchup(): Promise<{ park1: Park; park2: Park }> {
    const parksList = Array.from(this.parks.values());
    if (parksList.length < 2) {
      throw new Error("Not enough parks to create a matchup");
    }
    
    // Shuffle parks array to get random parks
    const shuffled = [...parksList].sort(() => 0.5 - Math.random());
    
    return {
      park1: shuffled[0],
      park2: shuffled[1],
    };
  }

  async createPark(insertPark: InsertPark): Promise<Park> {
    const id = this.currentParkId++;
    const park: Park = {
      ...insertPark,
      id,
      elo: 1500, // Initial ELO rating
      rank: this.parks.size + 1, // Initial rank
    };
    this.parks.set(id, park);
    return park;
  }

  async updateParkElo(id: number, newElo: number, newRank: number): Promise<Park> {
    const park = await this.getParkById(id);
    if (!park) {
      throw new Error(`Park with id ${id} not found`);
    }
    
    const updatedPark: Park = {
      ...park,
      previousElo: park.elo,
      elo: newElo,
      previousRank: park.rank,
      rank: newRank,
    };
    
    this.parks.set(id, updatedPark);
    return updatedPark;
  }

  async getRankings(): Promise<Park[]> {
    const parksList = Array.from(this.parks.values());
    return parksList.sort((a, b) => b.elo - a.elo);
  }

  // Vote operations
  async createVote(insertVote: InsertVote): Promise<Vote> {
    const id = this.currentVoteId++;
    const timestamp = new Date();
    const vote: Vote = { ...insertVote, id, timestamp };
    this.votes.set(id, vote);
    return vote;
  }

  async getRecentVotes(limit: number): Promise<Vote[]> {
    const votesList = Array.from(this.votes.values());
    return votesList
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // Seed the parks database with initial data
  async seedParks(): Promise<void> {
    if (this.parks.size === 0) {
      // Seed with national parks from the data file
      for (const park of nationalParks) {
        await this.createPark(park);
      }
      
      // Update rankings after seeding
      const rankedParks = await this.getRankings();
      for (let i = 0; i < rankedParks.length; i++) {
        const park = rankedParks[i];
        await this.updateParkElo(park.id, park.elo, i + 1);
      }
    }
  }
}

export const storage = new MemStorage();
