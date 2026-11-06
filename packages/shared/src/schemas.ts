// Zod schemas: rules that describe what our data must look like.
// The API uses them to check input. The types come from the same rules.

import { z } from "zod";

export const gameIdSchema = z.enum(["lotto-649", "lotto-max", "daily-grand"]);

export const gameSchema = z.object({
  id: gameIdSchema,
  name: z.string(),
  pickCount: z.number().int().positive(),
  maxNumber: z.number().int().positive(),
  bonusMax: z.number().int().positive(),
});

export const drawSchema = z.object({
  id: z.string(),
  gameId: gameIdSchema,
  date: z.iso.date(),
  numbers: z.array(z.number().int().positive()),
  bonus: z.number().int().positive(),
});

// Query string values arrive as text, so z.coerce turns "2" into the number 2.
export const drawFiltersSchema = z.object({
  gameId: gameIdSchema.optional(),
  from: z.iso.date().optional(),
  to: z.iso.date().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const frequencyQuerySchema = z.object({
  gameId: gameIdSchema,
  from: z.iso.date().optional(),
  to: z.iso.date().optional(),
});

export const frequencyEntrySchema = z.object({
  number: z.number().int().positive(),
  count: z.number().int().min(0),
});

export const frequencyResultSchema = z.object({
  totalDraws: z.number().int().min(0),
  counts: z.array(frequencyEntrySchema),
  hot: z.array(frequencyEntrySchema),
  cold: z.array(frequencyEntrySchema),
});

export type DrawFilters = z.infer<typeof drawFiltersSchema>;
export type FrequencyQuery = z.infer<typeof frequencyQuerySchema>;
