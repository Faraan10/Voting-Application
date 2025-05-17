import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - keeping original structure
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// National Parks table
export const parks = pgTable("parks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  state: text("state").notNull(),
  imageUrl: text("image_url").notNull(),
  icon: text("icon").notNull(),
  established: text("established"),
  elo: integer("elo").notNull().default(1500), // Default ELO rating
  previousElo: integer("previous_elo"),
  rank: integer("rank"),
  previousRank: integer("previous_rank"),
});

export const insertParkSchema = createInsertSchema(parks).omit({
  id: true,
  elo: true,
  previousElo: true,
  rank: true,
  previousRank: true,
});

export type InsertPark = z.infer<typeof insertParkSchema>;
export type Park = typeof parks.$inferSelect;

// Votes table to track voting history
export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  winnerId: integer("winner_id").notNull(),
  loserId: integer("loser_id").notNull(),
  winnerEloBefore: integer("winner_elo_before").notNull(),
  loserEloBefore: integer("loser_elo_before").notNull(),
  winnerEloAfter: integer("winner_elo_after").notNull(),
  loserEloAfter: integer("loser_elo_after").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertVoteSchema = createInsertSchema(votes).omit({
  id: true,
  timestamp: true,
});

export type InsertVote = z.infer<typeof insertVoteSchema>;
export type Vote = typeof votes.$inferSelect;
