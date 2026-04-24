// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { describe, expect, it } from "vitest";
import { type Bounds, contains, createBounds } from "./bounds";

describe("createBounds", () => {
  it("should work correctly", () => {
    expect(
      createBounds(
        { latitude: -10, longitude: -100 },
        {
          latitude: 10,
          longitude: 100,
        }
      )
    ).toEqual({
      north: 10,
      south: -10,
      east: 100,
      west: -100,
    } satisfies Bounds);

    expect(
      createBounds(
        { latitude: -10, longitude: 100 },
        {
          latitude: 10,
          longitude: -100,
        }
      )
    ).toEqual({
      north: 10,
      south: -10,
      east: 100,
      west: -100,
    } satisfies Bounds);

    expect(
      createBounds(
        { latitude: 10, longitude: -100 },
        {
          latitude: -10,
          longitude: 100,
        }
      )
    ).toEqual({
      north: 10,
      south: -10,
      east: 100,
      west: -100,
    } satisfies Bounds);

    expect(
      createBounds(
        { latitude: 10, longitude: 100 },
        {
          latitude: -10,
          longitude: -100,
        }
      )
    ).toEqual({
      north: 10,
      south: -10,
      east: 100,
      west: -100,
    } satisfies Bounds);
  });
});

describe("contains", () => {
  it("should work correctly", () => {
    const bounds = createBounds(
      { latitude: -10, longitude: -100 },
      {
        latitude: 10,
        longitude: 100,
      }
    );

    expect(contains(bounds, { latitude: 0, longitude: 0 })).toBe(true);
    expect(contains(bounds, { latitude: 120, longitude: 45 })).toBe(false);
    expect(contains(bounds, { latitude: -10, longitude: -100 })).toBe(true);
    expect(contains(bounds, { latitude: 10, longitude: -100 })).toBe(true);
    expect(contains(bounds, { latitude: -10, longitude: 100 })).toBe(true);
    expect(contains(bounds, { latitude: 10, longitude: 100 })).toBe(true);
  });
});
