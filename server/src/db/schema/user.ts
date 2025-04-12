import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { z } from "zod";

export const users = pgTable("users", {
  id: serial().primaryKey(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }),
  googleId: varchar({ length: 255 }).notNull(),
  name: varchar({ length: 255 }).notNull(),
  bio: text(),
  refreshToken: text(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const selectUsersSchema = createSelectSchema(users);

export const insertUserGoogleSchema = createInsertSchema(users, {
  email: z.string().email(),
  name: z.string().min(1),
  googleId: z.string().min(1),
}).omit({
  password: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserEmailSchema = createInsertSchema(users, {
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(8),
}).omit({
  googleId: true,
  createdAt: true,
  bio: true,
});
