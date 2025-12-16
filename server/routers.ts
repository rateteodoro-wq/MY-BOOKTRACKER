import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import * as llm from "./llm";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Book management
  book: router({
    getOrCreate: protectedProcedure
      .input(z.object({ title: z.string().optional(), description: z.string().optional(), targetChapters: z.number().optional() }))
      .mutation(async ({ ctx, input }) => {
        const existing = await db.getUserBook(ctx.user.id);
        if (existing) return existing;
        
        const result = await db.createBook(
          ctx.user.id,
          input.title || "My Book",
          input.description,
          input.targetChapters
        );
        return result;
      }),
    get: protectedProcedure.query(async ({ ctx }) => {
      let book = await db.getUserBook(ctx.user.id);
      if (!book) {
        await db.createBook(ctx.user.id, "Meu Livro", "Livro criado automaticamente", 20);
        book = await db.getUserBook(ctx.user.id);
      }
      return book || null;
    }),
    update: protectedProcedure
      .input(z.object({ title: z.string().optional(), description: z.string().optional(), targetChapters: z.number().optional() }))
      .mutation(async ({ ctx, input }) => {
        const book = await db.getUserBook(ctx.user.id);
        if (!book) throw new Error("Book not found");
        
        const result = await db.updateBook(book.id, input);
        return result;
      }),
  }),

  // Chapter management
  chapters: router({
    list: protectedProcedure
      .input(z.object({ bookId: z.number() }))
      .query(async ({ input }) => {
        return await db.getChaptersByBook(input.bookId);
      }),
    create: protectedProcedure
      .input(z.object({ bookId: z.number(), chapterNumber: z.number(), title: z.string() }))
      .mutation(async ({ input }) => {
        return await db.createChapter(input.bookId, input.chapterNumber, input.title);
      }),
    update: protectedProcedure
      .input(z.object({ chapterId: z.number(), status: z.enum(["not_started", "writing", "reviewing", "completed"]).optional(), progress: z.number().optional(), notes: z.string().optional(), nextSteps: z.string().optional() }))
      .mutation(async ({ input }) => {
        const { chapterId, ...updates } = input;
        return await db.updateChapter(chapterId, updates);
      }),
    get: protectedProcedure
      .input(z.object({ chapterId: z.number() }))
      .query(async ({ input }) => {
        return await db.getChapterById(input.chapterId);
      }),
  }),

  // Session management
  sessions: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getSessionsByUser(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({ bookId: z.number(), mode: z.enum(["maintenance", "construction"]), chapterId: z.number().optional() }))
      .mutation(async ({ ctx, input }) => {
        return await db.createSession(ctx.user.id, input.bookId, input.mode, input.chapterId);
      }),
    update: protectedProcedure
      .input(z.object({ sessionId: z.number(), endTime: z.date().optional(), duration: z.number().optional(), notesCount: z.number().optional(), sessionNotes: z.string().optional() }))
      .mutation(async ({ input }) => {
        const { sessionId, ...updates } = input;
        return await db.updateSession(sessionId, updates);
      }),
  }),

  // Atomic notes
  notes: router({
    create: protectedProcedure
      .input(z.object({ bookId: z.number(), content: z.string(), chapterId: z.number().optional(), sessionId: z.number().optional(), tags: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        return await db.createAtomicNote(ctx.user.id, input.bookId, input.content, input.chapterId, input.sessionId, input.tags);
      }),
    getByChapter: protectedProcedure
      .input(z.object({ chapterId: z.number() }))
      .query(async ({ input }) => {
        return await db.getNotesByChapter(input.chapterId);
      }),
  }),

  // Rituals
  rituals: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getRitualsByUser(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({ type: z.enum(["entry_maintenance", "exit_maintenance", "entry_construction", "exit_construction"]), date: z.date() }))
      .mutation(async ({ ctx, input }) => {
        return await db.createRitual(ctx.user.id, input.type, input.date);
      }),
    update: protectedProcedure
      .input(z.object({ ritualId: z.number(), completed: z.number().optional(), checklistItems: z.string().optional(), notes: z.string().optional() }))
      .mutation(async ({ input }) => {
        const { ritualId, ...updates } = input;
        return await db.updateRitual(ritualId, updates);
      }),
  }),

  // Milestones
  milestones: router({
    list: protectedProcedure
      .input(z.object({ bookId: z.number() }))
      .query(async ({ input }) => {
        return await db.getMilestonesByBook(input.bookId);
      }),
    create: protectedProcedure
      .input(z.object({ bookId: z.number(), description: z.string(), type: z.enum(["chapter_completed", "milestone_words", "consistency_streak", "custom"]), celebrationNotes: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        const milestone = await db.createMilestone(ctx.user.id, input.bookId, input.description, input.type);
        return milestone;
      }),
  }),

  // User settings
  settings: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserSettings(ctx.user.id);
    }),
    update: protectedProcedure
      .input(z.object({ notificationsEnabled: z.number().optional(), maintenanceReminderTime: z.string().optional(), constructionReminderTime: z.string().optional(), emailNotifications: z.number().optional() }))
      .mutation(async ({ ctx, input }) => {
        return await db.createOrUpdateUserSettings(ctx.user.id, input);
      }),
  }),

  // AI/LLM integration
  ai: router({
    generateSuggestion: protectedProcedure
      .input(z.object({ context: z.string(), chapterContent: z.string() }))
      .mutation(async ({ input }) => {
        return await llm.generateTextSuggestion(input.context, input.chapterContent);
      }),
    reviewParagraph: protectedProcedure
      .input(z.object({ paragraph: z.string() }))
      .mutation(async ({ input }) => {
        return await llm.reviewParagraph(input.paragraph);
      }),
    generateIdeas: protectedProcedure
      .input(z.object({ notes: z.array(z.string()) }))
      .mutation(async ({ input }) => {
        return await llm.generateIdeasFromNotes(input.notes);
      }),
  }),
});

export type AppRouter = typeof appRouter;
