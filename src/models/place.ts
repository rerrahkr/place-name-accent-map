// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import type * as Leaflet from "leaflet";
import type { LikeState } from "./like";
import type { Mora, MoraPitch } from "./mora";

export type PlaceData = {
  id: string;
  latLng: Leaflet.LatLng;
  nameData: PlaceNameData;
  likeState: LikeState;
};

// TODO: createPlaceData

export type PlaceNameData = {
  spelling: string;
  moras: Mora[];
  pitches: MoraPitch[];
};

/**
 * Create `PlaceNameData` object.
 * @param spelling Place name spelling.
 * @param moras Moras of place name.
 * @param pitches Pitch accent sequence of place name.
 */
export function createPlaceNameData(
  spelling: string,
  moras: Mora[],
  pitches: MoraPitch[]
): PlaceNameData {
  if (
    spelling.length === 0 ||
    moras.length === 0 ||
    moras.length !== pitches.length
  ) {
    throw new Error("Invalid arguments.");
  }

  return {
    spelling,
    moras,
    pitches,
  };
}
