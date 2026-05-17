// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { describe, expect, it } from "vitest";
import { toggleLike } from "./like";
import { createUserId } from "./user";

describe("toggleLike", () => {
  it("should work correctly", () => {
    expect(toggleLike([createUserId("hoge")], createUserId("fuga"))).toEqual([
      createUserId("hoge"),
      createUserId("fuga"),
    ]);
    expect(
      toggleLike(
        [createUserId("hoge"), createUserId("fuga"), createUserId("piyo")],
        createUserId("fuga")
      )
    ).toEqual([createUserId("hoge"), createUserId("piyo")]);
  });
});
