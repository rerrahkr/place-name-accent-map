// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { describe, expect, it } from "vitest";
import { difference } from "./set";

describe("difference", () => {
  it("should works correctly", () => {
    expect(difference(new Set([1, 2, 3]), new Set([2]))).toEqual(
      new Set([1, 3])
    );

    expect(difference(new Set([1, 2, 3]), new Set([2, 4]))).toEqual(
      new Set([1, 3])
    );

    expect(difference(new Set([1, 2, 3]), new Set([1, 2, 3]))).toEqual(
      new Set([])
    );

    expect(difference(new Set([1, 2, 3]), new Set([]))).toEqual(
      new Set([1, 2, 3])
    );
  });
});
