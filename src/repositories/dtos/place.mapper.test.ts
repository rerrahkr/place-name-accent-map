// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { describe, expect, it } from "vitest";
import { encode } from "@/lib/geohash";
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
import type { LikeListResponse } from "./like";
import type { PlaceDataRequest, PlaceDataResponse } from "./place";
import {
  createPlaceDataFromResponse,
  placeDataToRequest,
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
      geohash: encode(coordinate),
      spelling: "ほげ",
      moras: ["ほ", "げ"],
      pitches: [1, 0],
      readingKey: "hoge",
      author,
      createdAt: new Date().toISOString(),
    };

    const likeListRes: LikeListResponse = [
      {
        placeId: placeRes.id,
        userId: "piyo",
        timestamp: new Date().toISOString(),
      },
      {
        placeId: placeRes.id,
        userId: "piyopiyo",
        timestamp: new Date().toISOString(),
      },
    ];

    expect(createPlaceDataFromResponse(placeRes, likeListRes)).toEqual({
      id: placeId,
      coordinate,
      nameData: createPlaceNameData(
        placeRes.spelling,
        placeRes.moras,
        ["H", "L"],
        createReadingKey(placeRes.readingKey)
      ),
      author,
      likedUsers: likeListRes.map((like) => createUserId(like.userId)),
    } satisfies PlaceData);

    expect(createPlaceDataFromResponse(placeRes, [])).toEqual({
      id: placeId,
      coordinate,
      nameData: createPlaceNameData(
        placeRes.spelling,
        placeRes.moras,
        ["H", "L"],
        createReadingKey(placeRes.readingKey)
      ),
      author,
      likedUsers: [],
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

    expect(placeDataToRequest(place)).toEqual({
      id: place.id,
      latitude: place.coordinate.latitude,
      longitude: place.coordinate.longitude,
      geohash: encode(place.coordinate),
      spelling: place.nameData.spelling,
      moras: place.nameData.moras,
      pitches: [1, 0],
      readingKey: "hoge",
      author: place.author,
    } satisfies PlaceDataRequest);
  });
});
