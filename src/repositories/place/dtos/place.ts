// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { z } from "zod";
import { geohashSchema } from "../geohash";

export const placeIdSchema = z.uuidv7();
export const userIdSchema = z.string().trim().min(1);

const latitudeScehema = z.number().min(-90).max(90);
const longitudeSchema = z.number().min(-180).max(180);
const moraSchema = z
  .string()
  .min(1)
  .regex(/^[\u3040-\u309F\u30F4ー]+$/);
const pitchSchema = z.literal([0, 1]);
const readingKeySchema = z.string().regex(/^[a-z]+$/);

export const placeDataRequestSchema = z
  .object({
    id: placeIdSchema,
    latitude: latitudeScehema,
    longitude: longitudeSchema,
    geohash: geohashSchema.length(9),
    spelling: z.string().trim().min(1),
    moras: z.array(moraSchema).min(1),
    pitches: z.array(pitchSchema).min(1),
    readingKey: readingKeySchema,
    author: userIdSchema,
  })
  .refine((obj) => obj.moras.length === obj.pitches.length);
export type PlaceDataRequest = z.infer<typeof placeDataRequestSchema>;

export const placeDataResponseSchema = z.object({
  ...placeDataRequestSchema.shape,
  createdAt: z.iso.datetime(),
});
export type PlaceDataResponse = z.infer<typeof placeDataResponseSchema>;

export const placeDataListResponseSchema = z.array(placeDataResponseSchema);
export type PlaceDataListResponse = z.infer<typeof placeDataListResponseSchema>;
