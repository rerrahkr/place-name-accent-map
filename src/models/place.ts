// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { z } from "zod";
import { newId } from "@/lib/id";
import { type Coordinate, coordinateSchema } from "./coordinate";
import { type LikedUsers, likedUsersSchema, toggleLike } from "./like";
import { type PlaceNameData, placeNameDataSchema } from "./place-name";
import { type UserId, userIdSchema } from "./user";

export const placeIdSchema = z.uuidv7().brand<"PlaceId">();
export type PlaceId = z.infer<typeof placeIdSchema>;

export function createPlaceId(id: string): PlaceId {
  return placeIdSchema.parse(id);
}

export function createNewPlaceId(): PlaceId {
  return createPlaceId(newId());
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
 * Create a place data.
 * @param id ID of place data.
 * @param coordinate Coordinate.
 * @param nameData `PlaceNameData`
 * @param author User ID of author.
 * @param likedUsers List of users who like this data.
 */
export function createPlaceData(
  id: PlaceId,
  coordinate: Coordinate,
  nameData: PlaceNameData,
  author: UserId,
  likedUsers: LikedUsers
): PlaceData {
  const newData: PlaceData = {
    id,
    coordinate,
    nameData,
    author,
    likedUsers,
  };

  placeDataSchema.parse(newData);

  return newData;
}

/**
 * Create a new place data.
 * @param id ID of place data.
 * @param coordinate Coordinate.
 * @param nameData `PlaceNameData`
 * @param author User ID of author.
 */
export function createNewPlaceData(
  id: PlaceId,
  coordinate: Coordinate,
  nameData: PlaceNameData,
  author: UserId
): PlaceData {
  return createPlaceData(id, coordinate, nameData, author, []);
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
