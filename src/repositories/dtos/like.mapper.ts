// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import type { PlaceId } from "@/models/place";
import type { UserId } from "@/models/user";
import {
  type LikeListRequest,
  type LikeRequest,
  likeListRequestSchema,
} from "./like";

export function likedUsersListToRequest(
  placeId: PlaceId,
  users: UserId[]
): LikeListRequest {
  const request: LikeListRequest = users.map(
    (userId) =>
      ({
        placeId,
        userId,
      }) satisfies LikeRequest
  );

  return likeListRequestSchema.parse(request);
}
