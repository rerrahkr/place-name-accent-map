// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { ZodError } from "zod";
import { db } from "@/lib/firebase";
import type { Bounds } from "@/models/bounds";
import type { PlaceData, PlaceId } from "@/models/place";
import {
  RequestSchemaError,
  ResponseSchemaError,
  ServerSystemError,
} from "../../errors";
import {
  boundsToGridGeoHashes,
  createGeoHash,
  createGridGeoHash,
  type GridGeoHash,
} from "../geohash";
import {
  getPlaceFromCache,
  getPlacesInGridFromCache,
  gridIsRegisteredInCache,
  registerPlacesToCache,
} from "../place-cache";
import type { PlaceRepository } from "../place-repository";
import {
  type PlaceDataCreateRequest,
  type PlaceDataListResponse,
  type PlaceDataResponse,
  type PlaceDataUpdateRequest,
  placeDataListResponseSchema,
  placeDataResponseSchema,
} from "./dtos/place";
import {
  createPlaceDataFromResponse,
  makePlaceDataUpdateRequest,
  placeDataToCreateRequest,
} from "./dtos/place.mapper";

function getPlacesCollection() {
  return collection(db, "places");
}

async function getPlaceResponse(
  placeId: string
): Promise<PlaceDataResponse | undefined> {
  const response = await (async () => {
    try {
      const docRef = doc(getPlacesCollection(), placeId);
      const docSnap = await getDoc(docRef);
      return docSnap.data();
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
  const response = await (async () => {
    try {
      const q = query(getPlacesCollection(), where("grid", "in", grids));
      const querySnap = await getDocs(q);
      return querySnap.docs.map((d) => d.data());
    } catch (err: unknown) {
      console.error(err);
      throw new ServerSystemError(err);
    }
  })();

  const parseResult = placeDataListResponseSchema.safeParse(response);
  if (!parseResult.success || parseResult.data === undefined) {
    throw new ResponseSchemaError(parseResult.error);
  }

  return parseResult.data;
}

async function sendPlaceCreateRequest(
  request: PlaceDataCreateRequest
): Promise<void> {
  try {
    const docRef = doc(getPlacesCollection(), request.id);
    await setDoc(docRef, request);
  } catch (err: unknown) {
    throw new ServerSystemError(err);
  }
}

async function sendPlaceUpdateRequest(
  placeId: PlaceId,
  request: PlaceDataUpdateRequest
): Promise<void> {
  try {
    const docRef = doc(getPlacesCollection(), placeId);
    await updateDoc(docRef, request);
  } catch (err: unknown) {
    throw new ServerSystemError(err);
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
    if (uncachedGrids.length === 0) {
      return [];
    }

    const placesResponse = await getPlaceListResponse(uncachedGrids);
    if (placesResponse.length === 0) {
      return [];
    }

    try {
      return placesResponse.map((place) => createPlaceDataFromResponse(place));
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

  try {
    const newPlace = createPlaceDataFromResponse(placeResponse);

    registerPlacesToCache([placeResponse.grid], [newPlace]);

    return newPlace;
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      throw new ResponseSchemaError(err);
    } else {
      throw err;
    }
  }
}

async function addPlace(place: PlaceData): Promise<void> {
  const request = (() => {
    try {
      return placeDataToCreateRequest(place);
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        throw new RequestSchemaError(err);
      } else {
        throw err;
      }
    }
  })();

  await sendPlaceCreateRequest(request);

  registerPlacesToCache([request.grid], [place]);
}

async function updatePlace(place: PlaceData): Promise<void> {
  const prevPlace = getPlaceFromCache(place.id);
  if (!prevPlace) {
    return addPlace(place);
  }

  const request = (() => {
    try {
      const newPlaceRequest = placeDataToCreateRequest(place);
      const prevPlaceRequest = placeDataToCreateRequest(prevPlace);
      return makePlaceDataUpdateRequest(newPlaceRequest, prevPlaceRequest);
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        throw new RequestSchemaError(err);
      } else {
        throw err;
      }
    }
  })();
  if (!request) {
    // No change.
    return;
  }

  await sendPlaceUpdateRequest(place.id, request);

  registerPlacesToCache(
    [createGridGeoHash(createGeoHash(place.coordinate))],
    [place]
  );
}

export const placeRepository: PlaceRepository = {
  getPlaces,
  getPlace,
  addPlace,
  updatePlace,
} as const;
