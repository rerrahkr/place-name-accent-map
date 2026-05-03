// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { describe, expect, test } from "vitest";
import { createReadingKeyFromMoras } from "./reading-key";

describe("createReadingKey", () => {
  test("simple replace", () => {
    expect(createReadingKeyFromMoras(["せ", "き", "し"])).toBe("sekishi");
    expect(createReadingKeyFromMoras(["ち", "づ"])).toBe("chizu");
    expect(createReadingKeyFromMoras(["い", "ず"])).toBe("izu");
  });

  test("long vowels", () => {
    expect(createReadingKeyFromMoras(["お", "お", "さ", "か"])).toBe("osaka");
    expect(createReadingKeyFromMoras(["お", "さ", "か"])).toBe("osaka");
    expect(createReadingKeyFromMoras(["お", "ー", "さ", "か"])).toBe("osaka");
    expect(
      createReadingKeyFromMoras(["お", "お", "ー", "お", "さ", "か"])
    ).toBe("osaka");

    expect(
      createReadingKeyFromMoras(["お", "お", "お", "か", "や", "ま"])
    ).toBe("okayama");
  });

  test("fusion vowels", () => {
    expect(createReadingKeyFromMoras(["あ", "の", "う"])).toBe("ano");
    expect(createReadingKeyFromMoras(["あ", "の", "お"])).toBe("ano");
    expect(createReadingKeyFromMoras(["と", "う", "え", "い"])).toBe("toe");
  });

  test("youon", () => {
    expect(createReadingKeyFromMoras(["りゅ", "う", "が", "さ", "き"])).toBe(
      "ryugasaki"
    );
  });

  test("small vowel", () => {
    expect(
      createReadingKeyFromMoras([
        "ゆ",
        "に",
        "ヴぁ",
        "ー",
        "さ",
        "る",
        "し",
        "てぃ",
      ])
    ).toBe("yunibasarushichi");
  });

  test("sokuon", () => {
    expect(createReadingKeyFromMoras(["し", "っ", "ぽ", "う"])).toBe("shipo");
  });

  test("Illegal sequence", () => {
    expect(createReadingKeyFromMoras(["ー", "あ", "っ"])).toBe("a");

    expect(() => createReadingKeyFromMoras(["ー", "っ"])).toThrow();
  });
});
