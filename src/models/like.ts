// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { z } from "zod";

export const likeStateSchema = z.object({
  count: z.number().nonnegative(),
  isLiked: z.boolean(),
});

export type LikeState = z.infer<typeof likeStateSchema>;

/**
 * Return a new like state.
 */
export function createLikeState(): LikeState {
  return {
    count: 0,
    isLiked: false,
  };
}

/**
 * Toggle a give like state on/off.
 * @param currentState Current like state.
 * @returns Toggled like state.
 */
export function toggleLike(currentState: LikeState): LikeState {
  const count = currentState.isLiked
    ? Math.max(0, currentState.count - 1)
    : Math.max(1, currentState.count + 1);

  return {
    ...currentState,
    count,
    isLiked: !currentState.isLiked,
  };
}
