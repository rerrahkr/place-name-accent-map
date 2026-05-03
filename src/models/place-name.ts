// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { z } from "zod";
import { type Mora, type MoraPitch, moraPitchSchema, moraSchema } from "./mora";
import {
  createReadingKeyFromMoras,
  type ReadingKey,
  readingKeySchema,
} from "./reading-key";

export const placeNameDataSchema = z
  .object({
    spelling: z.string().trim().min(1),
    moras: z.array(moraSchema).min(1),
    pitches: z.array(moraPitchSchema).min(1),
    readingKey: readingKeySchema,
  })
  .refine((data) => data.moras.length === data.pitches.length);

export type PlaceNameData = z.infer<typeof placeNameDataSchema>;

/**
 * Create a `PlaceNameData` object.
 * @param spelling Place name spelling.
 * @param moras Moras of place name.
 * @param pitches Pitch accent sequence of place name.
 * @param readingKey Reading key.
 */
export function createPlaceNameData(
  spelling: string,
  moras: Mora[],
  pitches: MoraPitch[],
  readingKey: ReadingKey
): PlaceNameData {
  const newData: PlaceNameData = {
    spelling,
    moras,
    pitches,
    readingKey,
  };

  placeNameDataSchema.parse(newData);

  return newData;
}

/**
 * Create a new `PlaceNameData` object.
 * @param spelling Place name spelling.
 * @param moras Moras of place name.
 * @param pitches Pitch accent sequence of place name.
 */
export function createNewPlaceNameData(
  spelling: string,
  moras: Mora[],
  pitches: MoraPitch[]
): PlaceNameData {
  const newData: PlaceNameData = {
    spelling,
    moras,
    pitches,
    readingKey: createReadingKeyFromMoras(moras),
  };

  placeNameDataSchema.parse(newData);

  return newData;
}
