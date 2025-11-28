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
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  height: integer("height").notNull(),
  weight: integer("weight").notNull(),
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
