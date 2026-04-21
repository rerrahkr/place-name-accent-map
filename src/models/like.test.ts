// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { describe, expect, it } from "vitest";
import { toggleLike } from "./like";

describe("toggleLike", () => {
  it("should work correctly", () => {
    expect(toggleLike(["hoge"], "fuga")).toEqual(["hoge", "fuga"]);
    expect(toggleLike(["hoge", "fuga", "piyo"], "fuga")).toEqual([
      "hoge",
      "piyo",
    ]);
  });
});
