// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { z } from "zod";

export const userIdSchema = z.string().trim().min(1).brand<"UserId">();
export type UserId = z.infer<typeof userIdSchema>;

export function createUserId(id: string): UserId {
  return userIdSchema.parse(id);
}
