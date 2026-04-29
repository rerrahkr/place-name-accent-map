// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { z } from "zod";
import { type Mora, type MoraPitch, moraPitchSchema, moraSchema } from "./mora";
import { createReadingKey, readingKeySchema } from "./reading-key";

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
    readingKey: createReadingKey(moras),
  };

  placeNameDataSchema.parse(newData);

  return newData;
}
