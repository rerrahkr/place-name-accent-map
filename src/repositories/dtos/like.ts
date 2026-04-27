// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { z } from "zod";
import { placeIdSchema, userIdSchema } from "./place";

export const likeDtoSchema = z.object({
  placeId: placeIdSchema,
  userId: userIdSchema,
});

export type LikeDto = z.infer<typeof likeDtoSchema>;
