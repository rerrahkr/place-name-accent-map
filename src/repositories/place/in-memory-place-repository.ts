// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { ZodError } from "zod";
import type { Bounds } from "@/models/bounds";
import { createNewPlaceId, type PlaceData, type PlaceId } from "@/models/place";
import {
  type LikeListRequest,
  type LikeListResponse,
  type LikeResponse,
  likeListResponseSchema,
} from "./dtos/like";
import { likedUsersListToRequest } from "./dtos/like.mapper";
import {
  type PlaceDataListResponse,
  type PlaceDataRequest,
  type PlaceDataResponse,
  placeDataListResponseSchema,
  placeDataResponseSchema,
} from "./dtos/place";
import {
  createPlaceDataFromResponse,
  placeDataToRequest,
} from "./dtos/place.mapper";
import {
  RequestSchemaError,
  ResponseSchemaError,
  ServerRuleError,
  ServerSystemError,
} from "./errors";
import {
  boundsToGridGeoHashes,
  createGeoHash,
  createGridGeoHash,
  type GridGeoHash,
  isInGridGeoHash,
} from "./geohash";
import {
  getPlaceFromCache,
  getPlacesInGridFromCache,
  gridIsRegisteredInCache,
  registerPlacesToCache,
} from "./place-cache";
import type { PlaceRepository } from "./place-repository";

type PlaceDataDocument = PlaceDataResponse;

type LikeDocument = LikeResponse;

const datalist: PlaceDataDocument[] = [
  {
    id: createNewPlaceId(),
    latitude: 35.681236,
    longitude: 139.767125,
    geohash: createGeoHash({
      latitude: 35.681236,
      longitude: 139.767125,
    }),
    spelling: "東京",
    moras: ["と", "ー", "きょ", "ー"],
    pitches: [0.0, 1.0, 1.0, 1.0],
    readingKey: "tokyo",
    author: "piyo",
    createdAt: new Date().toISOString(),
  },
  {
    id: createNewPlaceId(),
    latitude: 35.689957,
    longitude: 139.700507,
    geohash: createGeoHash({
      latitude: 35.689957,
      longitude: 139.700507,
    }),
    spelling: "新宿",
    moras: ["し", "ん", "じゅ", "く"],
    pitches: [0, 1, 1, 1],
    readingKey: "shinjuku",
    author: "hogefuga",
    createdAt: new Date().toISOString(),
  },
];

const likedList: LikeDocument[] = [
  {
    placeId: datalist[1].id,
    userId: "piyo",
    timestamp: new Date().toISOString(),
  },
  {
    placeId: datalist[1].id,
    userId: "hogefugapiyo",
    timestamp: new Date().toISOString(),
  },
];

function generateTestData(count: number): PlaceDataDocument[] {
  const baseLat = 35.681236;
  const baseLng = 139.767125;

  // モーラとピッチの数を合わせる制約を維持
  const dummyAuthor = "dummy";
  const dummyMoras = ["て", "す", "と", "だ"];
  const dummyPitches: (0 | 1)[] = [0, 1, 1, 0];
  const dummyReadingKey = "tesutoda";

  return Array.from({ length: count }).map((_, i) => {
    // 新宿駅周辺に密集させるための重み付け
    // 70%のデータは駅のすぐ近く（約1km圏内）に、残りは少し離れた場所に配置
    const isDense = Math.random() > 0.3;
    const spread = isDense ? 0.03 : 0.06;

    const latitude = baseLat + (Math.random() - 0.5) * spread;
    const longitude = baseLng + (Math.random() - 0.5) * spread;

    return {
      id: createNewPlaceId(),
      latitude,
      longitude,
      geohash: createGeoHash({
        latitude,
        longitude,
      }),
      spelling: `地点${i + 1}`,
      moras: dummyMoras,
      pitches: dummyPitches,
      readingKey: dummyReadingKey,
      author: dummyAuthor,
      createdAt: new Date().toISOString(),
    } satisfies PlaceDataDocument;
  });
}

// 100件のデータを既存のリストに追加
const additionalData = generateTestData(100);
const placeDataList = [...datalist, ...additionalData];

async function getPlaceResponse(
  placeId: string
): Promise<PlaceDataResponse | undefined> {
  const response = await (async () => {
    try {
      return Promise.resolve(
        placeDataList.find((place) => place.id === placeId)
      );
    } catch (err: unknown) {
      throw new ServerSystemError(err);
    }
  })();

  if (response === undefined) {
    return undefined;
  }

  const parseResult = placeDataResponseSchema.safeParse(response);
  if (!parseResult.success || parseResult.data === undefined) {
    throw new ResponseSchemaError(parseResult.error);
  }

  return parseResult.data;
}

async function getPlaceListResponse(
  grids: GridGeoHash[]
): Promise<PlaceDataListResponse> {
  const response: unknown = await (async () => {
    try {
      return Promise.resolve(
        placeDataList.filter(({ geohash }) =>
          grids.some((grid) => isInGridGeoHash(geohash, grid))
        )
      );
    } catch (err: unknown) {
      throw new ServerSystemError(err);
    }
  })();

  const parseResult = placeDataListResponseSchema.safeParse(response);
  if (!parseResult.success || parseResult.data === undefined) {
    throw new ResponseSchemaError(parseResult.error);
  }

  return parseResult.data;
}

async function getLikeListResponseMap(
  placeIds: string[]
): Promise<Map<string, LikeListResponse>> {
  const response = await (async () => {
    try {
      const responseMap = new Map<string, unknown>();
      for (const placeId of placeIds) {
        responseMap.set(
          placeId,
          likedList.filter((liked) => liked.placeId === placeId)
        );
      }
      return Promise.resolve(responseMap);
    } catch (err: unknown) {
      throw new ServerSystemError(err);
    }
  })();

  const dict = new Map<string, LikeListResponse>();
  for (const [placeId, obj] of response.entries()) {
    const parseResult = likeListResponseSchema.safeParse(obj);
    if (!parseResult || parseResult.data === undefined) {
      throw new ResponseSchemaError(parseResult.error);
    }

    dict.set(placeId, parseResult.data);
  }

  return dict;
}

async function sendPlaceUpdateRequest(
  request: PlaceDataRequest
): Promise<void> {
  try {
    const newDocument: PlaceDataDocument = {
      ...request,
      createdAt: new Date().toISOString(),
    };

    const index = placeDataList.findIndex((place) => place.id === request.id);

    if (index === -1) {
      // Create.
      placeDataList.push(newDocument);
    } else {
      placeDataList[index] = newDocument;
    }

    return Promise.resolve();
  } catch (err: unknown) {
    if (err instanceof ServerRuleError) {
      throw err;
    } else {
      throw new ServerSystemError(err);
    }
  }
}

async function sendLikeListUpdateRequest(
  request: LikeListRequest
): Promise<void> {
  try {
    for (const req of request) {
      if (
        likedList.find(
          (like) => like.placeId === req.placeId && like.userId === req.userId
        )
      ) {
        continue;
      }

      likedList.push({
        ...req,
        timestamp: new Date().toISOString(),
      });
    }

    return Promise.resolve();
  } catch (err: unknown) {
    if (err instanceof ServerRuleError) {
      throw err;
    } else {
      throw new ServerSystemError(err);
    }
  }
}

async function getPlaces(bounds: Bounds): Promise<PlaceData[]> {
  const grids = boundsToGridGeoHashes(bounds);
  const [cachedGrids, uncachedGrids] = (() => {
    const sorted: GridGeoHash[][] = [[], []];
    for (const grid of grids) {
      sorted[gridIsRegisteredInCache(grid) ? 0 : 1].push(grid);
    }
    return sorted;
  })();

  // Get new places from server and register them to cache.
  const newPlaces = await (async () => {
    const placesResponse = await getPlaceListResponse(uncachedGrids);
    if (placesResponse.length === 0) {
      return [];
    }

    const placeIds = placesResponse.map((place) => place.id);
    const likes = await getLikeListResponseMap(placeIds);

    try {
      return placesResponse.map((place) =>
        createPlaceDataFromResponse(place, likes.get(place.id) ?? [])
      );
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        throw new ResponseSchemaError(err);
      } else {
        throw err;
      }
    }
  })();

  registerPlacesToCache(uncachedGrids, newPlaces);

  // Get cached places.
  const cachedPlaces = cachedGrids.flatMap((grid) =>
    getPlacesInGridFromCache(grid)
  );

  return [...cachedPlaces, ...newPlaces];
}

async function getPlace(placeId: PlaceId): Promise<PlaceData | undefined> {
  // Try to get place data from cache.
  const cachedPlace = getPlaceFromCache(placeId);
  if (cachedPlace) {
    return cachedPlace;
  }

  // If cache miss, get place data from server and register it to cache.
  const placeResponse = await getPlaceResponse(placeId);
  if (!placeResponse) {
    return undefined;
  }

  const likes = await getLikeListResponseMap([placeResponse.id]);

  try {
    const newPlace = createPlaceDataFromResponse(
      placeResponse,
      likes.get(placeId) ?? []
    );

    registerPlacesToCache(
      [createGridGeoHash(placeResponse.geohash)],
      [newPlace]
    );

    return newPlace;
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      throw new ResponseSchemaError(err);
    } else {
      throw err;
    }
  }
}

async function updatePlace(place: PlaceData): Promise<void> {
  const [placeRequest, likeListRequest] = (() => {
    try {
      const placeRequest = placeDataToRequest(place);
      const likeRequest = likedUsersListToRequest(place.id, place.likedUsers);
      return [placeRequest, likeRequest];
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        throw new RequestSchemaError(err);
      } else {
        throw err;
      }
    }
  })();

  sendPlaceUpdateRequest(placeRequest);
  sendLikeListUpdateRequest(likeListRequest);

  registerPlacesToCache([createGridGeoHash(placeRequest.geohash)], [place]);
}

export const inMemoryPlaceRepository: PlaceRepository = {
  getPlaces,
  getPlace,
  addPlace: updatePlace,
  updatePlace,
} as const;
