// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { describe, expect, it } from "vitest";
import { createPlaceNameData, type PlaceNameData } from "./place";

const correctPlaceNameData: PlaceNameData = {
  spelling: "品川",
  moras: ["し", "な", "が", "わ"],
  pitches: ["L", "H", "H", "H"],
};

describe("createPlaceNameData", () => {
  it("should create a instance correctly", () => {
    expect(
      createPlaceNameData(
        correctPlaceNameData.spelling,
        correctPlaceNameData.moras,
        correctPlaceNameData.pitches
      )
    ).toEqual(correctPlaceNameData);
  });

  it("should be failed to create instances", () => {
    expect(() => createPlaceNameData("", ["あ"], ["H"])).toThrow();
    expect(() => createPlaceNameData("あ", ["", "こ"], ["H", "H"])).toThrow();
    expect(() => createPlaceNameData("あ", [], [])).toThrow();
    expect(() => createPlaceNameData("あ", [""], ["H"])).toThrow();
    expect(() => createPlaceNameData("あ", ["a"], ["H"])).toThrow();
    expect(() => createPlaceNameData("あ", ["あ", "ー"], ["H"])).toThrow();
    expect(() => createPlaceNameData("あ", ["あ"], ["H", "L"])).toThrow();
  });
});
