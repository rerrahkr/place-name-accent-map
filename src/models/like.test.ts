// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { describe, expect, it } from "vitest";
import { createLikeState, type LikeState, toggleLike } from "./like";

describe("createLikeState", () => {
  it("should initialize LikeState", () => {
    expect(createLikeState()).toEqual({
      count: 0,
      isLiked: false,
    } satisfies LikeState);
  });
});

describe("toggleLike", () => {
  it("should toggle on", () => {
    expect(
      toggleLike({
        count: 4,
        isLiked: false,
      })
    ).toEqual({
      count: 5,
      isLiked: true,
    } satisfies LikeState);

    // Illegal previous state.
    expect(
      toggleLike({
        count: -1,
        isLiked: false,
      })
    ).toEqual({
      count: 1,
      isLiked: true,
    } satisfies LikeState);
  });

  it("should toggle off", () => {
    expect(
      toggleLike({
        count: 2,
        isLiked: true,
      })
    ).toEqual({
      count: 1,
      isLiked: false,
    } satisfies LikeState);

    // Illegal previous state.
    expect(
      toggleLike({
        count: 0,
        isLiked: true,
      })
    ).toEqual({
      count: 0,
      isLiked: false,
    } satisfies LikeState);
  });
});
