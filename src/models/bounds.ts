// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { z } from "zod";
import { type Coordinate, latitudeSchema, longitudeSchema } from "./coordinate";

export const boundsSchema = z.object({
  north: latitudeSchema,
  south: latitudeSchema,
  east: longitudeSchema,
  west: longitudeSchema,
});

export type Bounds = z.infer<typeof boundsSchema>;

/**
 * Create bounds from two coordinates.
 * @param corner1 One of the bounds corner.
 * @param corner2 Diagonally opposite corner of `corner1`.
 */
export function createBounds(corner1: Coordinate, corner2: Coordinate): Bounds {
  return {
    north: Math.max(corner1.latitude, corner2.latitude),
    south: Math.min(corner1.latitude, corner2.latitude),
    east: Math.max(corner1.longitude, corner2.longitude),
    west: Math.min(corner1.longitude, corner2.longitude),
  };
}

/**
 * Check whether a bounds contains a given coordinate.
 * @param bounds Bounds.
 * @param coordinate Coordinate.
 * @returns `true` when a coordinate is in a bounds.
 */
export function contains(bounds: Bounds, coordinate: Coordinate): boolean {
  return (
    bounds.south <= coordinate.latitude &&
    coordinate.latitude <= bounds.north &&
    bounds.west <= coordinate.longitude &&
    coordinate.longitude <= bounds.east
  );
}
