// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { FieldValue, Timestamp } from "firebase/firestore";
import { z } from "zod";
import { gridGeohashSchema } from "../../geohash";

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
const likedUsersSchema = z.array(userIdSchema);

const firestoreFieldValueSchema = z.custom<FieldValue>(
  (val) => val instanceof FieldValue
);

const placeDataCreateRequestBaseSchema = z.object({
  id: placeIdSchema,
  latitude: latitudeScehema,
  longitude: longitudeSchema,
  grid: gridGeohashSchema,
  spelling: z.string().trim().min(1),
  moras: z.array(moraSchema).min(1),
  pitches: z.array(pitchSchema).min(1),
  readingKey: readingKeySchema,
  author: userIdSchema,
  likedUids: likedUsersSchema,
  createdAt: firestoreFieldValueSchema,
});

export const placeDataCreateRequestSchema =
  placeDataCreateRequestBaseSchema.refine(
    (obj) => obj.moras.length === obj.pitches.length
  );
export type PlaceDataCreateRequest = z.infer<
  typeof placeDataCreateRequestSchema
>;

export const placeDataUpdateRequestSchema = z.object({
  likedUids: z.union([firestoreFieldValueSchema, likedUsersSchema]),
});
/**
 * Handle only liked user IDs.
 */
export type PlaceDataUpdateRequest = z.infer<
  typeof placeDataUpdateRequestSchema
>;

export const placeDataResponseSchema = z.object({
  ...placeDataCreateRequestSchema.shape,
  createdAt: z.instanceof(Timestamp),
});
export type PlaceDataResponse = z.infer<typeof placeDataResponseSchema>;

export const placeDataListResponseSchema = z.array(placeDataResponseSchema);
export type PlaceDataListResponse = z.infer<typeof placeDataListResponseSchema>;
