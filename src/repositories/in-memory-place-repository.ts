// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import Leaflet from "leaflet";
import { newId } from "@/lib/utils";
import type { PlaceData } from "@/types";
import type { PlaceRepository } from "./place-repository";

const placeDataList: PlaceData[] = [
  {
    id: newId(),
    latLng: Leaflet.latLng(35.681236, 139.767125),
    nameData: {
      spelling: "東京",
      moras: ["と", "ー", "きょ", "ー"],
      pitches: ["L", "H", "H", "H"],
    },
    likeInfo: {
      count: 10,
      isLiked: true,
    },
  },
  {
    id: newId(),
    latLng: Leaflet.latLng(35.689957, 139.700507),
    nameData: {
      spelling: "新宿",
      moras: ["し", "ん", "じゅ", "く"],
      pitches: ["L", "H", "H", "H"],
    },
    likeInfo: {
      count: 5,
      isLiked: false,
    },
  },
];

export const inMemoryPlaceRepository: PlaceRepository = {
  getPlaces: async (): Promise<PlaceData[]> => {
    return Promise.resolve([...placeDataList]);
  },

  addPlace: async (place: PlaceData): Promise<void> => {
    placeDataList.push(place);
  },

  toggleLike: async (id: string): Promise<void> => {
    const place = placeDataList.find((p) => p.id === id);
    if (place) {
      const newIsLiked = !place.likeInfo.isLiked;
      place.likeInfo.count += newIsLiked ? 1 : -1;
      place.likeInfo.isLiked = newIsLiked;
    }
  },
} as const;
