// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { describe, expect, it } from "vitest";
import { createNewPlaceId } from "@/models/place";
import { createUserId } from "@/models/user";
import type { LikeListRequest } from "./like";
import { likedUsersListToRequest } from "./like.mapper";

describe("likedUsersListToRequest", () => {
  it("should work correctly", () => {
    const placeId = createNewPlaceId();
    const userIds = ["hoge", "fuga", "piyo"].map((id) => createUserId(id));

    expect(likedUsersListToRequest(placeId, userIds)).toEqual([
      {
        placeId,
        userId: userIds[0],
      },
      {
        placeId,
        userId: userIds[1],
      },
      {
        placeId,
        userId: userIds[2],
      },
    ] satisfies LikeListRequest);

    expect(likedUsersListToRequest(placeId, [])).toEqual([]);
  });
});
