import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// Campaigns Table
export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description").notNull(),
  imageUrl: varchar("image_url", { length: 1024 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Zod schema for validation
export const insertCampaignSchema = createInsertSchema(campaigns);