import { relations } from "drizzle-orm";
import {
  check,
  date,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const equipmentType = pgEnum("equipment_type", [
  "grinder",
  "dripper",
  "kettle",
  "scale",
  "filter",
  "other",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const equipment = pgTable("equipment", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: equipmentType("type").notNull(),
  name: text("name").notNull(),
  brand: text("brand"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const coffeeBeans = pgTable("coffee_beans", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  country: text("country"),
  region: text("region"),
  farm: text("farm"),
  variety: text("variety"),
  processMethod: text("process_method"),
  roastDate: date("roast_date"),
  roaster: text("roaster"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const brews = pgTable(
  "brews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    beanId: uuid("bean_id").references(() => coffeeBeans.id, { onDelete: "set null" }),
    grinderId: uuid("grinder_id").references(() => equipment.id, { onDelete: "set null" }),
    dripperId: uuid("dripper_id").references(() => equipment.id, { onDelete: "set null" }),
    grindClicks: integer("grind_clicks"),
    waterTempC: numeric("water_temp_c", { precision: 4, scale: 1 }),
    doseG: numeric("dose_g", { precision: 5, scale: 1 }),
    waterG: numeric("water_g", { precision: 6, scale: 1 }),
    brewTimeSeconds: integer("brew_time_seconds"),
    method: text("method"),
    rating: integer("rating"),
    brewedAt: timestamp("brewed_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [check("rating_range", sql`${table.rating} between 1 and 5`)],
);

export const tastingNotes = pgTable("tasting_notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  brewId: uuid("brew_id")
    .notNull()
    .unique()
    .references(() => brews.id, { onDelete: "cascade" }),
  aroma: text("aroma"),
  flavor: text("flavor"),
  acidity: text("acidity"),
  body: text("body"),
  sweetness: text("sweetness"),
  aftertaste: text("aftertaste"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  equipment: many(equipment),
  coffeeBeans: many(coffeeBeans),
  brews: many(brews),
}));

export const equipmentRelations = relations(equipment, ({ one }) => ({
  user: one(users, { fields: [equipment.userId], references: [users.id] }),
}));

export const coffeeBeansRelations = relations(coffeeBeans, ({ one }) => ({
  user: one(users, { fields: [coffeeBeans.userId], references: [users.id] }),
}));

export const brewsRelations = relations(brews, ({ one }) => ({
  user: one(users, { fields: [brews.userId], references: [users.id] }),
  bean: one(coffeeBeans, { fields: [brews.beanId], references: [coffeeBeans.id] }),
  grinder: one(equipment, { fields: [brews.grinderId], references: [equipment.id] }),
  dripper: one(equipment, { fields: [brews.dripperId], references: [equipment.id] }),
  tastingNote: one(tastingNotes, { fields: [brews.id], references: [tastingNotes.brewId] }),
}));

export const tastingNotesRelations = relations(tastingNotes, ({ one }) => ({
  brew: one(brews, { fields: [tastingNotes.brewId], references: [brews.id] }),
}));
