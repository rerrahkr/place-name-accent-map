// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import type { PlaceData, PlaceId } from "@/models/place";
import { createGeoHash, createGridGeoHash, type GridGeoHash } from "./geohash";

/** Place data cache */
const placeCacheMap = new Map<PlaceId, PlaceData>();

/** Map of grids to their associated place IDs */
const gridCacheMap = new Map<GridGeoHash, PlaceId[]>();

/**
 * Add unregistered places to cache or update registered places in cache.
 * @param grids List of `GridGeoHash` where `places` are located.
 *              If a grid has no place, the cache registers the grid as empty
 *              region.
 * @param places Place data list. If a place is not located in `grids`,
 *               it will not be registered.
 */
export function registerPlacesToCache(
  grids: GridGeoHash[],
  places: PlaceData[]
) {
  for (const grid of grids) {
    if (!gridCacheMap.has(grid)) {
      gridCacheMap.set(grid, []);
    }
  }

  for (const place of places) {
    const grid = createGridGeoHash(createGeoHash(place.coordinate));
    if (!grids.includes(grid)) {
      // Skip place which is not located in given grids.
      continue;
    }

    const placesInGrid = gridCacheMap.get(grid);
    if (placesInGrid === undefined) {
      // Skip place which is not located in registered grids.
      continue;
    }

    // If the place is already registered, update it to the new one.
    // If it is not registered, add it to caches.
    if (!placeCacheMap.has(place.id)) {
      placesInGrid.push(place.id);
    }
    placeCacheMap.set(place.id, place);
  }
}

/**
 * Return `true` when cache have registered a given grid.
 * @param grid GridGeoHash
 */
export function gridIsRegisteredInCache(grid: GridGeoHash): boolean {
  return gridCacheMap.has(grid);
}

/**
 * Get place which has a given ID from cache.
 * @param placeId ID of place data.
 * @returns `PlaceData` or `undefined` if no place data which has a given ID was found.
 */
export function getPlaceFromCache(placeId: PlaceId): PlaceData | undefined {
  return placeCacheMap.get(placeId);
}

/**
 * Get places which are located in given grid from cache.
 * @param grid Search regions.
 * @returns Places which are located in `grid`.
 *          If cache has neither place nor grid, returns a empty list.
 */
export function getPlacesInGridFromCache(grid: GridGeoHash): PlaceData[] {
  const ids = gridCacheMap.get(grid);
  if (!ids) {
    return [];
  }

  return ids.map((id) => placeCacheMap.get(id)).filter((v) => !!v);
}

/**
 * Clear cache.
 */
export function clearCache() {
  placeCacheMap.clear();
  gridCacheMap.clear();
}
