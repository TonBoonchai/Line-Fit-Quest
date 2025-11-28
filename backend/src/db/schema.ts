import { sql } from "drizzle-orm";
import { int } from "drizzle-orm/mysql-core";
import {
  boolean,
  check,
  date,
  doublePrecision,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  time,
  timestamp,
  unique,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  displayName: text("display_name").notNull(),
  age: integer("age").notNull().default(18),
  gender: text("gender").notNull().default("unspecified"),
  height: integer("height").notNull().default(170),
  weight: integer("weight").notNull().default(70),
  health: integer("health_points").notNull().default(10),
  energy: integer("energy_points").notNull().default(10),
  exp: integer("exp_points").notNull().default(0),
  rank: integer("rank").notNull().default(1),
  nextLevelExp: integer("next_level_exp").notNull().default(100),
});

export const questsTable = pgTable("quests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  healthPoints: integer("health_points").notNull(),
  energyPoints: integer("energy_points").notNull(),
  expPoints: integer("exp_points").notNull(),
  progress: integer("progress").notNull().default(0),
  goal: integer("goal").notNull(),
  completed: boolean("completed").notNull().default(false),
});
