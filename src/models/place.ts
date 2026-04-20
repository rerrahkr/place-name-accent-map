// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import type * as Leaflet from "leaflet";
import { z } from "zod";
import { createLikeState, likeStateSchema } from "./like";
import { type Mora, type MoraPitch, moraPitchSchema, moraSchema } from "./mora";

export const placeNameDataSchema = z
  .object({
    spelling: z.string().trim().min(1),
    moras: z.array(moraSchema).min(1),
    pitches: z.array(moraPitchSchema).min(1),
  })
  .refine((data) => data.moras.length === data.pitches.length);

export type PlaceNameData = z.infer<typeof placeNameDataSchema>;

/**
 * Create `PlaceNameData` object.
 * @param spelling Place name spelling.
 * @param moras Moras of place name.
 * @param pitches Pitch accent sequence of place name.
 */
export function createPlaceNameData(
  spelling: string,
  moras: Mora[],
  pitches: MoraPitch[]
): PlaceNameData {
  const newData: PlaceNameData = {
    spelling,
    moras,
    pitches,
  };

  placeNameDataSchema.parse(newData);

  return newData;
}

export const placeDataSchema = z.object({
  id: z.uuidv7(),
  latLng: z.unknown(),
  nameData: placeNameDataSchema,
  likeState: likeStateSchema,
});

const placeDataSchemaWithoutLatLng = placeDataSchema.omit({
  latLng: true,
});

export type PlaceData = z.infer<typeof placeDataSchemaWithoutLatLng> & {
  latLng: Leaflet.LatLng;
};

/**
 * Create new place data.
 * @param id ID of place data.
 * @param latLng Latitude and longitude.
 * @param nameData `PlaceNameData`
 */
export function createPlaceData(
  id: string,
  latLng: Leaflet.LatLng,
  nameData: PlaceNameData
): PlaceData {
  const newData: PlaceData = {
    id,
    latLng,
    nameData,
    likeState: createLikeState(),
  };

  placeDataSchema.parse(newData);

  return newData;
}
