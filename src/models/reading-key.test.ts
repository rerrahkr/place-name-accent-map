// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { describe, expect, test } from "vitest";
import { createReadingKey } from "./reading-key";

describe("createReadingKey", () => {
  test("simple replace", () => {
    expect(createReadingKey(["せ", "き", "し"])).toBe("sekishi");
    expect(createReadingKey(["ち", "づ"])).toBe("chizu");
    expect(createReadingKey(["い", "ず"])).toBe("izu");
  });

  test("long vowels", () => {
    expect(createReadingKey(["お", "お", "さ", "か"])).toBe("osaka");
    expect(createReadingKey(["お", "さ", "か"])).toBe("osaka");
    expect(createReadingKey(["お", "ー", "さ", "か"])).toBe("osaka");
    expect(createReadingKey(["お", "お", "ー", "お", "さ", "か"])).toBe(
      "osaka"
    );

    expect(createReadingKey(["お", "お", "お", "か", "や", "ま"])).toBe(
      "okayama"
    );
  });

  test("fusion vowels", () => {
    expect(createReadingKey(["あ", "の", "う"])).toBe("ano");
    expect(createReadingKey(["あ", "の", "お"])).toBe("ano");
    expect(createReadingKey(["と", "う", "え", "い"])).toBe("toe");
  });

  test("youon", () => {
    expect(createReadingKey(["りゅ", "う", "が", "さ", "き"])).toBe(
      "ryugasaki"
    );
  });

  test("small vowel", () => {
    expect(
      createReadingKey(["ゆ", "に", "ヴぁ", "ー", "さ", "る", "し", "てぃ"])
    ).toBe("yunibasarushichi");
  });

  test("sokuon", () => {
    expect(createReadingKey(["し", "っ", "ぽ", "う"])).toBe("shipo");
  });

  test("Illegal sequence", () => {
    expect(createReadingKey(["ー", "あ", "っ"])).toBe("a");

    expect(() => createReadingKey(["ー", "っ"])).toThrow();
  });
});
