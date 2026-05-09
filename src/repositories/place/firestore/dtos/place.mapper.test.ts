// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { describe, expect, it } from "vitest";
import { createCoordinate } from "@/models/coordinate";
import {
  createNewPlaceId,
  createPlaceData,
  type PlaceData,
} from "@/models/place";
import {
  createNewPlaceNameData,
  createPlaceNameData,
} from "@/models/place-name";
import { createReadingKey } from "@/models/reading-key";
import { createUserId } from "@/models/user";
import { createGeoHash, createGridGeoHash } from "../../geohash";
import type { PlaceDataCreateRequest, PlaceDataResponse } from "./place";
import {
  createPlaceDataFromResponse,
  placeDataToCreateRequest,
} from "./place.mapper";

describe("createPlaceDataFromResponse", () => {
  it("should work correctly", () => {
    const placeId = createNewPlaceId();
    const coordinate = createCoordinate(45, -20);
    const author = createUserId("fuga");
    const placeRes: PlaceDataResponse = {
      id: placeId,
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      grid: createGridGeoHash(createGeoHash(coordinate)),
      spelling: "ほげ",
      moras: ["ほ", "げ"],
      pitches: [1, 0],
      readingKey: "hoge",
      author,
      likedUids: ["piyo", "piyopiyo"],
      createdAt: expect.anything(),
    };

    expect(createPlaceDataFromResponse(placeRes)).toEqual({
      id: placeId,
      coordinate,
      nameData: createPlaceNameData(
        placeRes.spelling,
        placeRes.moras,
        ["H", "L"],
        createReadingKey(placeRes.readingKey)
      ),
      author,
      likedUsers: placeRes.likedUids.map((uid) => createUserId(uid)),
    } satisfies PlaceData);
  });
});

describe("placeDataToRequest", () => {
  it("should work correctly", () => {
    const place = createPlaceData(
      createNewPlaceId(),
      createCoordinate(20, -30),
      createNewPlaceNameData("ほげ", ["ほ", "げ"], ["H", "L"]),
      createUserId("fuga"),
      [createUserId("piyo")]
    );

    expect(placeDataToCreateRequest(place)).toEqual({
      id: place.id,
      latitude: place.coordinate.latitude,
      longitude: place.coordinate.longitude,
      grid: createGridGeoHash(createGeoHash(place.coordinate)),
      spelling: place.nameData.spelling,
      moras: place.nameData.moras,
      pitches: [1, 0],
      readingKey: "hoge",
      author: place.author,
      likedUids: place.likedUsers,
      createdAt: expect.anything(),
    } satisfies PlaceDataCreateRequest);
  });
});
