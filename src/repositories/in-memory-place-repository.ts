// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { type Bounds, contains } from "@/models/bounds";
import { createCoordinate } from "@/models/coordinate";
import type { Mora, MoraPitch } from "@/models/mora";
import {
  createNewPlaceId,
  createPlaceData,
  createPlaceNameData,
  type PlaceData,
} from "@/models/place";
import { userIdSchema } from "@/models/user";
import type { PlaceRepository } from "./place-repository";

const datalist: PlaceData[] = [
  {
    id: createNewPlaceId(),
    coordinate: createCoordinate(35.681236, 139.767125),
    nameData: {
      spelling: "東京",
      moras: ["と", "ー", "きょ", "ー"],
      pitches: ["L", "H", "H", "H"],
    },
    author: userIdSchema.parse("piyo"),
    likedUsers: ["hogefugapiyo", "fugafuga"].map((id) =>
      userIdSchema.parse(id)
    ),
  },
  {
    id: createNewPlaceId(),
    coordinate: createCoordinate(35.689957, 139.700507),
    nameData: {
      spelling: "新宿",
      moras: ["し", "ん", "じゅ", "く"],
      pitches: ["L", "H", "H", "H"],
    },
    author: userIdSchema.parse("hogefuga"),
    likedUsers: ["piyopiyo", "piyo", "hoge", "fuga", "fugapiyo"].map((id) =>
      userIdSchema.parse(id)
    ),
  },
];

const generateTestData = (count: number): PlaceData[] => {
  const baseLat = 35.681236;
  const baseLng = 139.767125;

  return Array.from({ length: count }).map((_, i) => {
    // 新宿駅周辺に密集させるための重み付け
    // 70%のデータは駅のすぐ近く（約1km圏内）に、残りは少し離れた場所に配置
    const isDense = Math.random() > 0.3;
    const spread = isDense ? 0.03 : 0.06;

    const lat = baseLat + (Math.random() - 0.5) * spread;
    const lng = baseLng + (Math.random() - 0.5) * spread;

    // モーラとピッチの数を合わせる制約を維持
    const dummyMoras: Mora[] = ["て", "す", "と", "だ"];
    const dummyPitches: MoraPitch[] = ["L", "H", "H", "L"];

    return createPlaceData(
      createNewPlaceId(),
      lat,
      lng,
      createPlaceNameData(`地点${i + 1}`, dummyMoras, dummyPitches),
      userIdSchema.parse(`user_${Math.floor(Math.random() * 1000)}`)
    );
  });
};

// 100件のデータを既存のリストに追加
const additionalData = generateTestData(100);
const placeDataList = [...datalist, ...additionalData];

export const inMemoryPlaceRepository: PlaceRepository = {
  getPlaces: async (bounds?: Bounds): Promise<PlaceData[]> => {
    if (bounds === undefined) {
      return Promise.resolve([...placeDataList]);
    }

    return Promise.resolve(
      placeDataList.filter(({ coordinate }) => contains(bounds, coordinate))
    );
  },

  getPlace: async (placeId: string): Promise<PlaceData | undefined> => {
    return Promise.resolve(placeDataList.find((place) => place.id === placeId));
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
