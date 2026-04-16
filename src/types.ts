// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import type * as Leaflet from "leaflet";
import type { MoraPitch } from "./utils/mora";

export type LikeInfo = {
  count: number;
  isLiked: boolean;
};

export type PlaceData = {
  id: string;
  latLng: Leaflet.LatLng;
  nameData: PlaceNameData;
  likeInfo: LikeInfo;
};

export type PlaceNameData = {
  spelling: string;
  moras: string[];
  pitches: MoraPitch[];
};
