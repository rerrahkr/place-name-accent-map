// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { z } from "zod";
import { placeIdSchema, userIdSchema } from "./place";

export const likeRequestSchema = z.object({
  placeId: placeIdSchema,
  userId: userIdSchema,
});
export type LikeRequest = z.infer<typeof likeRequestSchema>;

export const likeListRequestSchema = z.array(likeRequestSchema);
export type LikeListRequest = z.infer<typeof likeListRequestSchema>;

export const likeResponseSchema = z.object({
  ...likeRequestSchema.shape,
  timestamp: z.iso.datetime(),
});
export type LikeResponse = z.infer<typeof likeResponseSchema>;

export const likeListResponseSchema = z.array(likeResponseSchema);
export type LikeListResponse = z.infer<typeof likeListResponseSchema>;
