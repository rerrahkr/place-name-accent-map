// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import type { Bounds } from "@/models/bounds";
import type { PlaceData } from "@/models/place";

/**
 * Interface of repository for place data.
 */
export type PlaceRepository = {
  /**
   * Get some place data.
   * @param bounds Bounding box to filter places.
   *               If this is omitted, all place data are returned.
   */
  getPlaces: (bounds?: Bounds) => Promise<PlaceData[]>;

  /**
   * Get place data which has a given ID.
   * @param placeId ID of place data.
   */
  getPlace: (placeId: string) => Promise<PlaceData | undefined>;

  /**
   * Add a new place data.
   * @param place New place data.
   */
  addPlace: (place: PlaceData) => Promise<void>;

  /**
   * Update given place data.
   * @param place Edited place data.
   */
  updatePlace: (place: PlaceData) => Promise<void>;
};
