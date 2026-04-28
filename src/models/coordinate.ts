// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { z } from "zod";

export const latitudeSchema = z.number().min(-90).max(90);
export type Latitude = z.infer<typeof latitudeSchema>;

export const longitudeSchema = z.number().min(-180).max(180);
export type Longitude = z.infer<typeof longitudeSchema>;

export const coordinateSchema = z.object({
  latitude: latitudeSchema,
  longitude: longitudeSchema,
});

export type Coordinate = z.infer<typeof coordinateSchema>;

export function createCoordinate(
  latitude: number,
  longitude: number
): Coordinate {
  const data: Coordinate = {
    latitude,
    longitude,
  };

  return coordinateSchema.parse(data);
}
