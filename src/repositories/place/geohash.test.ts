// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { describe, expect, it } from "vitest";
import {
  boundsToGridGeoHashes,
  createGridGeoHash,
  geohashSchema,
  gridGeohashSchema,
  isInGridGeoHash,
} from "./geohash";

describe("createGridGeoHash", () => {
  it("should work correctly", () => {
    expect(createGridGeoHash(geohashSchema.parse("kkqnpp5e9"))).toBe("kkqnp");
  });
});

describe("boundsToGridGeoHashes", () => {
  it("should work correctly", () => {
    const expected = ["7zzzz", "kpbpb", "ebpbp", "s0000"];
    const actual = boundsToGridGeoHashes({
      north: 1e-5,
      south: 0,
      east: 1e-5,
      west: 0,
    });

    expect(actual).toEqual(expect.arrayContaining(expected));
    expect(actual.length).toBe(expected.length);
  });
});

describe("isInGridGeoHash", () => {
  it("should work correctly", () => {
    expect(
      isInGridGeoHash(
        geohashSchema.parse("7zzzzzzzz"),
        gridGeohashSchema.parse("7zzzz")
      )
    ).toBe(true);
    expect(
      isInGridGeoHash(
        geohashSchema.parse("7zzzzzzzz"),
        gridGeohashSchema.parse("kpbpb")
      )
    ).toBe(false);
  });
});
