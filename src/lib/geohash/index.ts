// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import geohash from "ngeohash";
import type { Bounds } from "@/models/bounds";
import { type Coordinate, createCoordinate } from "@/models/coordinate";

const DEFAULT_PRECISION = 9;

export function encode(
  { latitude, longitude }: Coordinate,
  precision: number = DEFAULT_PRECISION
): string {
  return geohash.encode(latitude, longitude, precision);
}

export function encodeBounds(
  { north, south, east, west }: Bounds,
  precision: number = DEFAULT_PRECISION
): string[] {
  return geohash.bboxes(south, west, north, east, precision);
}

export function decode(hash: string): Coordinate {
  const { latitude, longitude } = geohash.decode(hash);
  return createCoordinate(latitude, longitude);
}
export function decodeBounds(hash: string): Bounds {
  const [minlat, minlon, maxlat, maxlon] = geohash.decode_bbox(hash);
  return {
    north: maxlat,
    south: minlat,
    east: maxlon,
    west: minlon,
  };
}
