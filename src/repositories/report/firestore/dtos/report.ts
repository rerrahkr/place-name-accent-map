// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { FieldValue } from "firebase/firestore";
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
  uid: userIdSchema,
  deleteReason: deleteReasonSchema,
  createdAt: z.custom<FieldValue>((val) => val instanceof FieldValue),
});
export type ReportRequest = z.infer<typeof reportRequestSchema>;
