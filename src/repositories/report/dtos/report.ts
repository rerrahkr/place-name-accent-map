// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { z } from "zod";

export const placeIdSchema = z.uuidv7();
export const userIdSchema = z.string().trim().min(1);
export const deleteReasonSchema = z.union([
  z.literal("inappropriate"),
  z.literal("spam"),
  z.literal("duplicate"),
  z.literal("incorrect"),
]);

export const reportRequestSchema = z.object({
  placeId: placeIdSchema,
  userId: userIdSchema,
  deleteReason: deleteReasonSchema,
});
export type ReportRequest = z.infer<typeof reportRequestSchema>;
