// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { z } from "zod";
import type { Mora } from "./mora";

export const readingKeySchema = z
  .string()
  .regex(/^[a-z]+$/)
  .brand<"ReadingKey">();
export type ReadingKey = z.infer<typeof readingKeySchema>;

const YOUON_MAP: Record<string, string> = {
  きゃ: "kya",
  きゅ: "kyu",
  きょ: "kyo",
  くゅ: "kyu",
  くょ: "kyo",
  しゃ: "sha",
  しゅ: "shu",
  しょ: "sho",
  すゅ: "shu",
  すょ: "sho",
  ちゃ: "cha",
  ちゅ: "chu",
  ちょ: "cho",
  つゅ: "chu",
  つょ: "cho",
  てゅ: "chu",
  てょ: "cho",
  にゃ: "nya",
  にゅ: "nyu",
  にょ: "nyo",
  ひゃ: "hya",
  ひゅ: "hyu",
  ひょ: "hyo",
  ふゅ: "hyu",
  ふょ: "hyo",
  みゃ: "mya",
  みゅ: "myu",
  みょ: "myo",
  むゅ: "myu",
  むょ: "myo",
  りゃ: "rya",
  りゅ: "ryu",
  りょ: "ryo",
  ぎゃ: "gya",
  ぎゅ: "gyu",
  ぎょ: "gyo",
  ぐゅ: "gyu",
  ぐょ: "gyo",
  じゃ: "ja",
  じゅ: "ju",
  じょ: "jo",
  ずゅ: "ju",
  ずょ: "jo",
  ぢゃ: "ja",
  ぢゅ: "ju",
  ぢょ: "jo",
  づゅ: "ju",
  づょ: "jo",
  でゅ: "ju",
  でょ: "jo",
  びゃ: "bya",
  びゅ: "byu",
  びょ: "byo",
  ぶゅ: "byu",
  ぶょ: "byo",
  ぴゃ: "pya",
  ぴゅ: "pyu",
  ぴょ: "pyo",
  ぷゅ: "pyu",
  ぷょ: "pyo",
  ヴゅ: "byu",
  くゎ: "ka",
  ぐゎ: "ga",
} as const;

const SPECIAL_SMALL_VOWEL_MAP: Record<string, string> = {
  いぇ: "e",
  うぁ: "wa",
  うぃ: "i",
  うぇ: "e",
  うぉ: "o",
  きぇ: "ke",
  くぁ: "ka",
  くぃ: "ki",
  くぇ: "ke",
  くぉ: "ko",
  しぇ: "se",
  すぁ: "sa",
  すぃ: "shi",
  すぇ: "se",
  すぉ: "so",
  ちぇ: "che",
  つぁ: "cha",
  つぃ: "chi",
  つぇ: "che",
  つぉ: "cho",
  てぃ: "chi",
  とぅ: "tsu",
  にぇ: "ne",
  ひぇ: "he",
  ふぃ: "hi",
  ふぇ: "he",
  ヴぁ: "ba",
  ヴぃ: "bi",
  ヴぇ: "be",
  ヴぉ: "bo",
  ぐぁ: "ga",
  ぐぃ: "gi",
  ぐぇ: "ge",
  ぐぉ: "go",
  ずぁ: "za",
  ずぃ: "ji",
  ずぇ: "ze",
  ずぉ: "zo",
  づぁ: "za",
  づぃ: "ji",
  づぇ: "ze",
  づぉ: "zo",
  でぃ: "ji",
  どぅ: "zu",
  ぶぁ: "ba",
  ぶぃ: "bi",
  ぶぇ: "be",
  ぶぉ: "bo",
  ぷぁ: "pa",
  ぷぃ: "pi",
  ぷぇ: "pe",
  ぷぉ: "po",
} as const;

const SINGLE_MAP: Record<string, string> = {
  あ: "a",
  い: "i",
  う: "u",
  え: "e",
  お: "o",
  か: "ka",
  き: "ki",
  く: "ku",
  け: "ke",
  こ: "ko",
  さ: "sa",
  し: "shi",
  す: "su",
  せ: "se",
  そ: "so",
  た: "ta",
  ち: "chi",
  つ: "tsu",
  て: "te",
  と: "to",
  な: "na",
  に: "ni",
  ぬ: "nu",
  ね: "ne",
  の: "no",
  は: "ha",
  ひ: "hi",
  ふ: "fu",
  へ: "he",
  ほ: "ho",
  ま: "ma",
  み: "mi",
  む: "mu",
  め: "me",
  も: "mo",
  や: "ya",
  ゆ: "yu",
  よ: "yo",
  ら: "ra",
  り: "ri",
  る: "ru",
  れ: "re",
  ろ: "ro",
  わ: "wa",
  を: "o",
  ん: "n",
  が: "ga",
  ぎ: "gi",
  ぐ: "gu",
  げ: "ge",
  ご: "go",
  ざ: "za",
  じ: "ji",
  ず: "zu",
  ぜ: "ze",
  ぞ: "zo",
  だ: "da",
  ぢ: "ji",
  づ: "zu",
  で: "de",
  ど: "do",
  ば: "ba",
  び: "bi",
  ぶ: "bu",
  べ: "be",
  ぼ: "bo",
  ぱ: "pa",
  ぴ: "pi",
  ぷ: "pu",
  ぺ: "pe",
  ぽ: "po",
  ゔ: "bu",
  ぁ: "a",
  ぃ: "i",
  ぅ: "u",
  ぇ: "e",
  ぉ: "o",
  ゃ: "ya",
  ゅ: "yu",
  ょ: "yo",
};

const VOWEL_FUSION_MAP: Record<string, string> = {
  iu: "yu",
  ei: "e",
  ou: "o",
};

export function createReadingKey(key: string): ReadingKey {
  return readingKeySchema.parse(key);
}

export function createReadingKeyFromMoras(moras: Mora[]): ReadingKey {
  const rawReading = moras.join("");
  let result = "";

  for (let i = 0; i < rawReading.length; ) {
    const char = rawReading[i];
    const nextChar = rawReading[i + 1];

    if (nextChar) {
      // Check two-characters.
      const twoChars = char + nextChar;

      const youon = YOUON_MAP[twoChars];
      if (youon) {
        result += youon;
        i += 2;
        continue;
      }

      const special = SPECIAL_SMALL_VOWEL_MAP[twoChars];
      if (special) {
        result += special;
        i += 2;
        continue;
      }
    }

    // Remove sokuon.
    if (char === "っ") {
      i++;
      continue;
    }

    // Remove cho-on.
    if (char === "ー") {
      i++;
      continue;
    }

    // Transform single characters.
    const single = SINGLE_MAP[char];
    if (single) {
      result += single;
    }

    // Skip a character if unknown character is appeared.

    i++;
  }

  // Replace vowel fusions.
  for (const [org, fus] of Object.entries(VOWEL_FUSION_MAP)) {
    result = result.replaceAll(org, fus);
  }

  // Normalize sequential vowels in result.
  result = result.replace(/([aiueo])\1+/g, "$1");

  return createReadingKey(result);
}
