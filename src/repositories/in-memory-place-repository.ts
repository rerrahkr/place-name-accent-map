// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { newId } from "@/lib/utils";
import type { PlaceData } from "@/models/place";
import type { PlaceRepository } from "./place-repository";

const placeDataList: PlaceData[] = [
  {
    id: newId(),
    location: {
      latitude: 35.681236,
      longitude: 139.767125,
    },
    nameData: {
      spelling: "東京",
      moras: ["と", "ー", "きょ", "ー"],
      pitches: ["L", "H", "H", "H"],
    },
    author: "piyo",
    likedUsers: ["hogefugapiyo", "fugafuga"],
  },
  {
    id: newId(),
    location: {
      latitude: 35.689957,
      longitude: 139.700507,
    },
    nameData: {
      spelling: "新宿",
      moras: ["し", "ん", "じゅ", "く"],
      pitches: ["L", "H", "H", "H"],
    },
    author: "hogefuga",
    likedUsers: ["piyopiyo", "piyo", "hoge", "fuga", "fugapiyo"],
  },
];

export const inMemoryPlaceRepository: PlaceRepository = {
  getPlaces: async (): Promise<PlaceData[]> => {
    return Promise.resolve([...placeDataList]);
  },

  addPlace: async (place: PlaceData): Promise<void> => {
    placeDataList.push(place);
  },

  updatePlace: async (place: PlaceData): Promise<void> => {
    const index = placeDataList.findIndex(
      (p) => p.id === place.id && p.author === place.author
    );
    if (index === -1) {
      throw new Error("Not found the same id and author data.");
    }

    placeDataList[index] = place;
  },
} as const;
