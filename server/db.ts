import { drizzle } from "drizzle-orm/mysql2";
import { eq, desc } from "drizzle-orm";
import { InsertUser, users, books, chapters, sessions, atomicNotes, rituals, milestones, userSettings, InsertChapter, InsertSession, InsertAtomicNote, InsertRitual, InsertMilestone, InsertUserSettings } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ BOOK QUERIES ============

export async function getUserBook(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(books).where(eq(books.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createBook(userId: number, title: string, description?: string, targetChapters?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(books).values({
    userId,
    title,
    description,
    targetChapters: targetChapters || 20,
  });
  // Fetch and return the created book
  const result = await db.select().from(books).where(eq(books.userId, userId)).orderBy(desc(books.createdAt)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateBook(bookId: number, updates: { title?: string; description?: string; targetChapters?: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(books).set(updates).where(eq(books.id, bookId));
  // Fetch and return the updated book
  const result = await db.select().from(books).where(eq(books.id, bookId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============ CHAPTER QUERIES ============

export async function getChaptersByBook(bookId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(chapters).where(eq(chapters.bookId, bookId)).orderBy(chapters.chapterNumber);
}

export async function getChapterById(chapterId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(chapters).where(eq(chapters.id, chapterId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createChapter(bookId: number, chapterNumber: number, title: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(chapters).values({
    bookId,
    chapterNumber,
    title,
    status: "not_started",
    progress: 0,
  });
  // Fetch and return the created chapter
  const result = await db.select().from(chapters).where(eq(chapters.bookId, bookId)).orderBy(desc(chapters.createdAt)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateChapter(chapterId: number, updates: Partial<InsertChapter>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(chapters).set(updates).where(eq(chapters.id, chapterId));
  // Fetch and return the updated chapter
  return await getChapterById(chapterId);
}

// ============ SESSION QUERIES ============

export async function createSession(userId: number, bookId: number, mode: "maintenance" | "construction", chapterId?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(sessions).values({
    userId,
    bookId,
    chapterId,
    mode,
    startTime: new Date(),
  });
}

export async function updateSession(sessionId: number, updates: Partial<InsertSession>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(sessions).set(updates).where(eq(sessions.id, sessionId));
}

export async function getSessionsByUser(userId: number, limit: number = 20) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(sessions).where(eq(sessions.userId, userId)).orderBy(desc(sessions.createdAt)).limit(limit);
}

// ============ ATOMIC NOTES QUERIES ============

export async function createAtomicNote(userId: number, bookId: number, content: string, chapterId?: number, sessionId?: number, tags?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(atomicNotes).values({
    userId,
    bookId,
    content,
    chapterId,
    sessionId,
    tags,
  });
}

export async function getNotesByChapter(chapterId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(atomicNotes).where(eq(atomicNotes.chapterId, chapterId)).orderBy(desc(atomicNotes.createdAt));
}

// ============ RITUAL QUERIES ============

export async function createRitual(userId: number, type: "entry_maintenance" | "exit_maintenance" | "entry_construction" | "exit_construction", date: Date) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(rituals).values({
    userId,
    type,
    date,
    completed: 0,
  });
}

export async function updateRitual(ritualId: number, updates: Partial<InsertRitual>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(rituals).set(updates).where(eq(rituals.id, ritualId));
}

export async function getRitualsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(rituals).where(eq(rituals.userId, userId)).orderBy(desc(rituals.date));
}

// ============ MILESTONE QUERIES ============

export async function createMilestone(userId: number, bookId: number, description: string, type: "chapter_completed" | "milestone_words" | "consistency_streak" | "custom") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(milestones).values({
    userId,
    bookId,
    description,
    type,
  });
}

export async function getMilestonesByBook(bookId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(milestones).where(eq(milestones.bookId, bookId)).orderBy(desc(milestones.date));
}

// ============ USER SETTINGS QUERIES ============

export async function getUserSettings(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(userSettings).where(eq(userSettings.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createOrUpdateUserSettings(userId: number, updates: Partial<InsertUserSettings>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getUserSettings(userId);
  if (existing) {
    return await db.update(userSettings).set(updates).where(eq(userSettings.userId, userId));
  } else {
    return await db.insert(userSettings).values({
      userId,
      notificationsEnabled: 1,
      emailNotifications: 1,
      maintenanceReminderTime: "19:00",
      constructionReminderTime: "06:45",
      ...updates,
    });
  }
}
