// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { arrayRemove, arrayUnion, serverTimestamp } from "firebase/firestore";
import { createCoordinate } from "@/models/coordinate";
import type { MoraPitch } from "@/models/mora";
import { createPlaceData, createPlaceId, type PlaceData } from "@/models/place";
import { createPlaceNameData } from "@/models/place-name";
import { createReadingKey } from "@/models/reading-key";
import { createUserId } from "@/models/user";
import { difference } from "@/utils/set";
import { createGeoHash, createGridGeoHash } from "../../geohash";
import {
  type PlaceDataCreateRequest,
  type PlaceDataResponse,
  type PlaceDataUpdateRequest,
  placeDataCreateRequestSchema,
} from "./place";

export function createPlaceDataFromResponse(
  placeRes: PlaceDataResponse
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
    placeRes.likedUids.map(createUserId)
  );
}

export function placeDataToCreateRequest(
  place: PlaceData
): PlaceDataCreateRequest {
  const request: PlaceDataCreateRequest = {
    id: place.id,
    latitude: place.coordinate.latitude,
    longitude: place.coordinate.longitude,
    grid: createGridGeoHash(createGeoHash(place.coordinate)),
    spelling: place.nameData.spelling,
    moras: place.nameData.moras,
    pitches: place.nameData.pitches.map((p) => (p === "H" ? 1 : 0)),
    readingKey: place.nameData.readingKey,
    author: place.author,
    likedUids: [...new Set(place.likedUsers)],
    createdAt: serverTimestamp(),
  };

  return placeDataCreateRequestSchema.parse(request);
}

export function makePlaceDataUpdateRequest(
  newReq: PlaceDataCreateRequest,
  prevReq: PlaceDataCreateRequest
): PlaceDataUpdateRequest | undefined {
  const newLikes = new Set(newReq.likedUids);
  const prevLikes = new Set(prevReq.likedUids);

  const newUids = difference(newLikes, prevLikes);
  const deletedUids = difference(prevLikes, newLikes);

  // If there are both additions and deletions, replace the entire array.
  if (newUids.size > 0 && deletedUids.size > 0) {
    return { likedUids: [...newLikes] };
  }

  // If only additions, use arrayUnion.
  if (newUids.size > 0 && deletedUids.size === 0) {
    return { likedUids: arrayUnion(...newUids) };
  }

  // If only deletions, use arrayRemove.
  if (deletedUids.size > 0 && newUids.size === 0) {
    return { likedUids: arrayRemove(...deletedUids) };
  }

  // No changes.
  return undefined;
}
