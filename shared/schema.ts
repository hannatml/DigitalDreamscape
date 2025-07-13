import { pgTable, text, serial, integer, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const zones = pgTable("zones", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  x: real("x").notNull(),
  y: real("y").notNull(),
  width: real("width").notNull(),
  height: real("height").notNull(),
});

export const characters = pgTable("characters", {
  id: serial("id").primaryKey(),
  name: text("name"),
  creator: text("creator").notNull(),
  shape: text("shape").notNull(), // circle, square, triangle, diamond
  color: text("color").notNull(), // hex color
  size: text("size").notNull(), // small, medium, large
  x: real("x").notNull(),
  y: real("y").notNull(),
  currentZone: text("current_zone").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCharacterSchema = createInsertSchema(characters).omit({
  id: true,
  createdAt: true,
});

export const insertZoneSchema = createInsertSchema(zones).omit({
  id: true,
});

export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type Character = typeof characters.$inferSelect;
export type InsertZone = z.infer<typeof insertZoneSchema>;
export type Zone = typeof zones.$inferSelect;

// WebSocket message types
export type WSMessage = 
  | { type: 'character_created'; character: Character }
  | { type: 'character_moved'; character: Character }
  | { type: 'characters_update'; characters: Character[] }
  | { type: 'population_update'; population: Record<string, number> };
