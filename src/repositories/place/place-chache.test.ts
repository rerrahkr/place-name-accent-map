// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { afterEach, describe, expect, it } from "vitest";
import { createCoordinate } from "@/models/coordinate";
import {
  createNewPlaceData,
  createNewPlaceId,
  type PlaceData,
} from "@/models/place";
import { createNewPlaceNameData } from "@/models/place-name";
import { createUserId } from "@/models/user";
import { gridGeohashSchema } from "./geohash";
import {
  clearCache,
  getPlaceFromCache,
  getPlacesInGridFromCache,
  gridIsRegisteredInCache,
  registerPlacesToCache,
} from "./place-cache";

const place1 = createNewPlaceData(
  createNewPlaceId(),
  createCoordinate(0, 0), // geohash: "7zzzzzzzz"
  createNewPlaceNameData("あ", ["あ"], ["H"]),
  createUserId("hoge")
);

const newPlace1: PlaceData = {
  ...place1,
  likedUsers: [...place1.likedUsers, createUserId("hoge")],
};

const place2: PlaceData = {
  ...place1,
  id: createNewPlaceId(),
  // geohash: "7zzzzzzzz"
};

const place3: PlaceData = {
  ...place1,
  id: createNewPlaceId(),
  coordinate: createCoordinate(-20, 20), // geohash: "kkqnpp5e9"
};

const grid12 = gridGeohashSchema.parse("7zzzz");
const grid3 = gridGeohashSchema.parse("kkqnp");

describe("Place cache", () => {
  describe("Register and cleanup", () => {
    it("should work correctly", () => {
      registerPlacesToCache([grid12], [place1]);
      expect(gridIsRegisteredInCache(grid12)).toBe(true);
      clearCache();
      expect(gridIsRegisteredInCache(grid12)).toBe(false);
    });
  });

  describe("Register and get by place ID", () => {
    afterEach(() => {
      clearCache();
    });

    it("should register new places and grids", () => {
      registerPlacesToCache([grid12], [place1]);

      expect(getPlaceFromCache(place1.id)).toEqual(place1);
      expect(getPlaceFromCache(place2.id)).toBeUndefined();
    });

    it("should register places only located in grids", () => {
      registerPlacesToCache([grid3], [place1, place3]);

      expect(getPlaceFromCache(place1.id)).toBeUndefined();
      expect(getPlaceFromCache(place3.id)).toEqual(place3);
    });

    it("should update registered place", () => {
      registerPlacesToCache([grid12], [place1]);

      expect(getPlaceFromCache(place1.id)).toEqual(place1);

      registerPlacesToCache([grid12], [newPlace1]);

      expect(getPlaceFromCache(place1.id)).toEqual(newPlace1);
    });
  });

  describe("Register and get by grid", () => {
    afterEach(() => {
      clearCache();
    });

    it("should register new places and grids", () => {
      registerPlacesToCache([grid12, grid3], [place1, place2, place3]);

      expect(gridIsRegisteredInCache(grid12)).toBe(true);
      expect(getPlacesInGridFromCache(grid12)).toEqual(
        expect.arrayContaining([place1, place2])
      );
      expect(getPlacesInGridFromCache(grid12).length).toBe(2);

      expect(gridIsRegisteredInCache(grid3)).toBe(true);
      expect(getPlacesInGridFromCache(grid3)).toEqual([place3]);
    });

    it("should register grids even if no place located", () => {
      registerPlacesToCache([grid12, grid3], [place3]);

      expect(gridIsRegisteredInCache(grid12)).toBe(true);
      expect(getPlacesInGridFromCache(grid12)).toEqual([]);

      expect(gridIsRegisteredInCache(grid3)).toBe(true);
      expect(getPlacesInGridFromCache(grid3)).toEqual([place3]);
    });

    it("should register places only located in grids", () => {
      registerPlacesToCache([grid3], [place1, place3]);

      expect(gridIsRegisteredInCache(grid3)).toBe(true);
      expect(getPlacesInGridFromCache(grid3)).toEqual([place3]);
    });

    it("should return no place when unregistered grid is given", () => {
      registerPlacesToCache([grid3], [place3]);

      expect(gridIsRegisteredInCache(grid12)).toBe(false);
      expect(getPlacesInGridFromCache(grid12)).toEqual([]);

      expect(gridIsRegisteredInCache(grid3)).toBe(true);
      expect(getPlacesInGridFromCache(grid3)).toEqual([place3]);
    });

    it("should update registered place", () => {
      registerPlacesToCache([grid12], [place1, place2]);

      expect(gridIsRegisteredInCache(grid12)).toBe(true);
      expect(getPlacesInGridFromCache(grid12)).toEqual(
        expect.arrayContaining([place1, place2])
      );
      expect(getPlacesInGridFromCache(grid12).length).toBe(2);

      registerPlacesToCache([grid12], [newPlace1]);

      expect(gridIsRegisteredInCache(grid12)).toBe(true);
      expect(getPlacesInGridFromCache(grid12)).toEqual(
        expect.arrayContaining([newPlace1, place2])
      );
      expect(getPlacesInGridFromCache(grid12).length).toBe(2);
    });
  });
});
