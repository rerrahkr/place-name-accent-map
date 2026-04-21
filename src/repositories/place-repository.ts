// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import type { PlaceData } from "@/models/place";

/**
 * Interface of repository for place data.
 */
export type PlaceRepository = {
  /**
   * Get all place data.
   */
  getPlaces(): Promise<PlaceData[]>;

  /**
   * Add a new place data.
   * @param place New place data.
   */
  addPlace(place: PlaceData): Promise<void>;

  /**
   * Update given place data.
   * @param place Edited place data.
   */
  updatePlace(place: PlaceData): Promise<void>;
};
