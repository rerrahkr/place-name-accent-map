// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { z } from "zod";

export const userIdSchema = z.string().trim().min(1);

export const likedUsersSchema = z.array(userIdSchema);

export type LikedUsers = z.infer<typeof likedUsersSchema>;

/**
 * Modify liked user's list by toggling like.
 * @param current Current likes list.
 * @param user ID of operated user.
 * @returns Modified likes list.
 */
export function toggleLike(current: LikedUsers, user: string): LikedUsers {
  const filtered = current.filter((id) => id !== user);
  return filtered.length === current.length ? [...filtered, user] : filtered;
}
