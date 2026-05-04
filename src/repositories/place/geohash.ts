// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { z } from "zod";
import { encode, encodeBounds } from "@/lib/geohash";
import type { Bounds } from "@/models/bounds";
import type { Coordinate } from "@/models/coordinate";

export const geohashCommonSchema = z.string().regex(/^[0-9b-hjkmnp-z]+$/);

export const geohashSchema = geohashCommonSchema.brand<"GeoHash">();
export type GeoHash = z.infer<typeof geohashSchema>;

export function createGeoHash(coordinate: Coordinate): GeoHash {
  return geohashSchema.parse(encode(coordinate));
}

export const gridGeohashSchema = geohashCommonSchema.brand<"GridGeoHash">();
export type GridGeoHash = z.infer<typeof gridGeohashSchema>;

const GRID_PRECISION = 5;

export function createGridGeoHash(geohash: GeoHash): GridGeoHash {
  return gridGeohashSchema.parse(geohash.slice(0, GRID_PRECISION));
}

export function boundsToGridGeoHashes(bounds: Bounds): GridGeoHash[] {
  return encodeBounds(bounds, GRID_PRECISION).map((gh) =>
    gridGeohashSchema.parse(gh)
  );
}

export function isInGridGeoHash(geohash: GeoHash, grid: GridGeoHash): boolean {
  return geohash.startsWith(grid);
}
