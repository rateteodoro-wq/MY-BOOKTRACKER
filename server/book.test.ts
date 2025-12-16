import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    email: `test${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: "test",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("book.get", () => {
  it("should return a book for an authenticated user", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    const book = await caller.book.get();

    expect(book).toBeDefined();
    expect(book?.id).toBeDefined();
    expect(book?.userId).toBe(1);
    expect(book?.title).toBeDefined();
    expect(book?.targetChapters).toBeGreaterThan(0);
  });

  it("should create a default book if user has none", async () => {
    const ctx = createAuthContext(999);
    const caller = appRouter.createCaller(ctx);

    const book = await caller.book.get();

    expect(book).toBeDefined();
    expect(book?.title).toBe("Meu Livro");
    expect(book?.targetChapters).toBe(20);
  });
});

describe("book.getOrCreate", () => {
  it("should create a book with custom title", async () => {
    const ctx = createAuthContext(2);
    const caller = appRouter.createCaller(ctx);

    const book = await caller.book.getOrCreate({
      title: "Custom Book Title",
      description: "A custom book",
      targetChapters: 30,
    });

    expect(book).toBeDefined();
    expect(book?.title).toBe("Custom Book Title");
    expect(book?.description).toBe("A custom book");
    expect(book?.targetChapters).toBe(30);
  });

  it("should return existing book if user already has one", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    // First call creates a book
    const book1 = await caller.book.getOrCreate({
      title: "First Book",
      targetChapters: 20,
    });

    // Second call should return the existing book
    const book2 = await caller.book.getOrCreate({
      title: "Second Book",
      targetChapters: 50,
    });

    expect(book2?.id).toBe(book1?.id);
    expect(book2?.title).toBe(book1?.title);
  });
});

describe("chapters.create", () => {
  it("should create a chapter for a book", async () => {
    const ctx = createAuthContext(3);
    const caller = appRouter.createCaller(ctx);

    // First get or create a book
    const book = await caller.book.getOrCreate({
      title: "Test Book",
      targetChapters: 10,
    });

    if (!book?.id) throw new Error("Book creation failed");

    // Create a chapter
    const chapter = await caller.chapters.create({
      bookId: book.id,
      chapterNumber: 1,
      title: "Chapter One",
    });

    expect(chapter).toBeDefined();
    expect(chapter?.chapterNumber).toBe(1);
    expect(chapter?.title).toBe("Chapter One");
    expect(chapter?.status).toBe("not_started");
    expect(chapter?.progress).toBe(0);
  });
});

describe("chapters.list", () => {
  it("should list chapters for a book", async () => {
    const ctx = createAuthContext(4);
    const caller = appRouter.createCaller(ctx);

    // Create a book
    const book = await caller.book.getOrCreate({
      title: "Book with Chapters",
      targetChapters: 5,
    });

    if (!book?.id) throw new Error("Book creation failed");

    // Create multiple chapters
    await caller.chapters.create({
      bookId: book.id,
      chapterNumber: 1,
      title: "Chapter 1",
    });

    await caller.chapters.create({
      bookId: book.id,
      chapterNumber: 2,
      title: "Chapter 2",
    });

    // List chapters
    const chapters = await caller.chapters.list({ bookId: book.id });

    expect(chapters).toBeDefined();
    expect(chapters.length).toBeGreaterThanOrEqual(2);
    expect(chapters[0]?.title).toBeDefined();
  });
});

describe("chapters.update", () => {
  it("should update chapter status and progress", async () => {
    const ctx = createAuthContext(5);
    const caller = appRouter.createCaller(ctx);

    // Create a book and chapter
    const book = await caller.book.getOrCreate({
      title: "Update Test Book",
      targetChapters: 5,
    });

    if (!book?.id) throw new Error("Book creation failed");

    const chapter = await caller.chapters.create({
      bookId: book.id,
      chapterNumber: 1,
      title: "Chapter to Update",
    });

    if (!chapter?.id) throw new Error("Chapter creation failed");

    // Update the chapter
    const updated = await caller.chapters.update({
      chapterId: chapter.id,
      status: "writing",
      progress: 50,
      notes: "Working on this chapter",
    });

    expect(updated?.status).toBe("writing");
    expect(updated?.progress).toBe(50);
    expect(updated?.notes).toBe("Working on this chapter");
  });
});

describe("book.update", () => {
  it("should update book title and target chapters", async () => {
    const ctx = createAuthContext(6);
    const caller = appRouter.createCaller(ctx);

    // Create a book
    const book = await caller.book.getOrCreate({
      title: "Original Title",
      targetChapters: 10,
    });

    if (!book?.id) throw new Error("Book creation failed");

    // Update the book
    const updated = await caller.book.update({
      title: "Updated Title",
      targetChapters: 25,
    });

    expect(updated?.title).toBe("Updated Title");
    expect(updated?.targetChapters).toBe(25);
  });

  it("should update only title without changing target chapters", async () => {
    const ctx = createAuthContext(7);
    const caller = appRouter.createCaller(ctx);

    // Create a book
    const book = await caller.book.getOrCreate({
      title: "Original Title",
      targetChapters: 15,
    });

    if (!book?.id) throw new Error("Book creation failed");

    // Update only title
    const updated = await caller.book.update({
      title: "Only Title Changed",
    });

    expect(updated?.title).toBe("Only Title Changed");
    expect(updated?.targetChapters).toBe(15);
  });
});
