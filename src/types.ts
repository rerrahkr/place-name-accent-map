// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import type * as Leaflet from "leaflet";
import type { MoraPitch } from "./utils/mora";

export type PlaceData = {
  latLng: Leaflet.LatLng;
  nameData: PlaceNameData;
};

export type PlaceNameData = {
  spelling: string;
  moras: string[];
  pitches: MoraPitch[];
};
