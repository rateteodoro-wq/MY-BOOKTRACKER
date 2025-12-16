import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Books table - stores information about the book being written
 */
export const books = mysqlTable("books", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  targetChapters: int("targetChapters").default(20).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Book = typeof books.$inferSelect;
export type InsertBook = typeof books.$inferInsert;

/**
 * Chapters table - tracks individual chapters of the book
 */
export const chapters = mysqlTable("chapters", {
  id: int("id").autoincrement().primaryKey(),
  bookId: int("bookId").notNull(),
  chapterNumber: int("chapterNumber").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["not_started", "writing", "reviewing", "completed"]).default("not_started").notNull(),
  progress: int("progress").default(0).notNull(), // 0-100
  notes: text("notes"),
  nextSteps: text("nextSteps"), // Hook for next session
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Chapter = typeof chapters.$inferSelect;
export type InsertChapter = typeof chapters.$inferInsert;

/**
 * Sessions table - tracks work sessions (Maintenance or Construction mode)
 */
export const sessions = mysqlTable("sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  bookId: int("bookId").notNull(),
  chapterId: int("chapterId"),
  mode: mysqlEnum("mode", ["maintenance", "construction"]).notNull(),
  startTime: timestamp("startTime").notNull(),
  endTime: timestamp("endTime"),
  duration: int("duration"), // in minutes
  notesCount: int("notesCount").default(0),
  sessionNotes: text("sessionNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;

/**
 * Atomic Notes table - captures individual notes during reading/study
 */
export const atomicNotes = mysqlTable("atomicNotes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  bookId: int("bookId").notNull(),
  sessionId: int("sessionId"),
  chapterId: int("chapterId"),
  content: text("content").notNull(),
  tags: varchar("tags", { length: 255 }), // comma-separated
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AtomicNote = typeof atomicNotes.$inferSelect;
export type InsertAtomicNote = typeof atomicNotes.$inferInsert;

/**
 * Rituals table - tracks completion of daily/weekly rituals
 */
export const rituals = mysqlTable("rituals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["entry_maintenance", "exit_maintenance", "entry_construction", "exit_construction"]).notNull(),
  date: timestamp("date").notNull(),
  completed: int("completed").default(0).notNull(), // 0 or 1 (boolean)
  checklistItems: text("checklistItems"), // JSON array of checklist items
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Ritual = typeof rituals.$inferSelect;
export type InsertRitual = typeof rituals.$inferInsert;

/**
 * Milestones table - celebrates achievements and victories
 */
export const milestones = mysqlTable("milestones", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  bookId: int("bookId").notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["chapter_completed", "milestone_words", "consistency_streak", "custom"]).notNull(),
  date: timestamp("date").defaultNow().notNull(),
  celebrationNotes: text("celebrationNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Milestone = typeof milestones.$inferSelect;
export type InsertMilestone = typeof milestones.$inferInsert;

/**
 * User Settings table - stores user preferences
 */
export const userSettings = mysqlTable("userSettings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  notificationsEnabled: int("notificationsEnabled").default(1).notNull(),
  maintenanceReminderTime: varchar("maintenanceReminderTime", { length: 5 }).default("19:00"), // HH:MM format
  constructionReminderTime: varchar("constructionReminderTime", { length: 5 }).default("06:45"),
  emailNotifications: int("emailNotifications").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserSettings = typeof userSettings.$inferSelect;
export type InsertUserSettings = typeof userSettings.$inferInsert;