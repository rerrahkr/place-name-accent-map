// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { createCoordinate } from "@/models/coordinate";
import type { MoraPitch } from "@/models/mora";
import { createPlaceData, createPlaceId, type PlaceData } from "@/models/place";
import { createPlaceNameData } from "@/models/place-name";
import { createReadingKey } from "@/models/reading-key";
import { createUserId } from "@/models/user";
import { createGeoHash } from "../geohash";
import type { LikeListResponse } from "./like";
import {
  type PlaceDataRequest,
  type PlaceDataResponse,
  placeDataRequestSchema,
} from "./place";

/**
 * @param likeListRes ALL items SHOULD have the same `placeId` which equals `placeRes.id`.
 *                    This function does not check this.
 */
export function createPlaceDataFromResponse(
  placeRes: PlaceDataResponse,
  likeListRes: LikeListResponse
): PlaceData {
  const pitches = placeRes.pitches.map<MoraPitch>((p) => (p === 1 ? "H" : "L"));

  return createPlaceData(
    createPlaceId(placeRes.id),
    createCoordinate(placeRes.latitude, placeRes.longitude),
    createPlaceNameData(
      placeRes.spelling,
      placeRes.moras,
      pitches,
      createReadingKey(placeRes.readingKey)
    ),
    createUserId(placeRes.author),
    likeListRes.map((l) => createUserId(l.userId))
  );
}

export function placeDataToRequest(place: PlaceData): PlaceDataRequest {
  const request: PlaceDataRequest = {
    id: place.id,
    latitude: place.coordinate.latitude,
    longitude: place.coordinate.longitude,
    geohash: createGeoHash(place.coordinate),
    spelling: place.nameData.spelling,
    moras: place.nameData.moras,
    pitches: place.nameData.pitches.map((p) => (p === "H" ? 1 : 0)),
    readingKey: place.nameData.readingKey,
    author: place.author,
  };

  return placeDataRequestSchema.parse(request);
}
