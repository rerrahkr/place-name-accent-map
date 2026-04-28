// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { z } from "zod";
import { newId } from "@/lib/utils";
import { coordinateSchema, createCoordinate } from "./coordinate";
import { likedUsersSchema, toggleLike } from "./like";
import { type Mora, type MoraPitch, moraPitchSchema, moraSchema } from "./mora";
import { type UserId, userIdSchema } from "./user";

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

export const placeIdSchema = z.uuidv7().brand<"PlaceId">();
export type PlaceId = z.infer<typeof placeIdSchema>;
export function createNewPlaceId(): PlaceId {
  return placeIdSchema.parse(newId());
}

export const placeDataSchema = z.object({
  id: placeIdSchema,
  coordinate: coordinateSchema,
  nameData: placeNameDataSchema,
  author: userIdSchema,
  likedUsers: likedUsersSchema,
});

export type PlaceData = z.infer<typeof placeDataSchema>;

/**
 * Create new place data.
 * @param id ID of place data.
 * @param latitude Latitude.
 * @param longitude Longitude.
 * @param nameData `PlaceNameData`
 * @param author User ID of author.
 */
export function createPlaceData(
  id: PlaceId,
  latitude: number,
  longitude: number,
  nameData: PlaceNameData,
  author: UserId
): PlaceData {
  const newData: PlaceData = {
    id,
    coordinate: createCoordinate(latitude, longitude),
    nameData,
    author,
    likedUsers: [],
  };

  placeDataSchema.parse(newData);

  return newData;
}

/**
 * Toggle like state of given place data.
 * @param place Modified place data.
 * @param user User who toggles like state.
 * @returns New place data.
 */
export function togglePlaceDataLike(place: PlaceData, user: UserId): PlaceData {
  return {
    ...place,
    likedUsers: toggleLike(place.likedUsers, user),
  };
}
