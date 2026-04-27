// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { z } from "zod";

export const placeIdSchema = z.uuidv7();
export const userIdSchema = z.string().trim().min(1);

const geohashSchema = z.string().regex(/^[0-9b-hjkmnp-z]+$/);
const latitudeScehema = z.number().min(-90).max(90);
const longitudeSchema = z.number().min(-180).max(180);
const moraSchema = z
  .string()
  .min(1)
  .regex(/^[\u3040-\u309F\u30F4ー]+$/);
const pitchSchema = z.literal([0, 1]);
const lowerAlphabetSchema = z.string().regex(/^[a-z]*$/);

export const placeDataDtoSchema = z
  .object({
    id: placeIdSchema,
    latitude: latitudeScehema,
    longitude: longitudeSchema,
    geohash: geohashSchema.length(9),
    spell: z.string().trim().min(1),
    moras: z.array(moraSchema).min(1),
    pitches: z.array(pitchSchema).min(1),
    likes: z.number().nonnegative(),
    compareKey: lowerAlphabetSchema.min(1),
    author: userIdSchema,
    createdAt: z.iso.datetime(),
  })
  .refine((obj) => obj.moras.length === obj.pitches.length);

export type PlaceDataDto = z.infer<typeof placeDataDtoSchema>;
