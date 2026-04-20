// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { z } from "zod";

export const moraSchema = z
  .string()
  .min(1)
  .regex(/^[\u3040-\u309F\u30F4ー]+$/);

/**
 * Mora characters.
 * Valid mora characters include:
 * - Hiragana
 * - Cho-on
 * - "ヴ"
 */
export type Mora = z.infer<typeof moraSchema>;

const TWO_CHARS_MORAS: ReadonlyArray<Mora> = [
  "きゃ",
  "きゅ",
  "きょ",
  "しゃ",
  "しゅ",
  "しょ",
  "ちゃ",
  "ちゅ",
  "ちょ",
  "にゃ",
  "にゅ",
  "にょ",
  "ひゃ",
  "ひゅ",
  "ひょ",
  "みゃ",
  "みゅ",
  "みょ",
  "りゃ",
  "りゅ",
  "りょ",
  "ぎゃ",
  "ぎゅ",
  "ぎょ",
  "じゃ",
  "じゅ",
  "じょ",
  "びゃ",
  "びゅ",
  "びょ",
  "ぴゃ",
  "ぴゅ",
  "ぴょ",
  "てぃ",
  "でぃ",
  "ふぁ",
  "ふぃ",
  "ふぇ",
  "ふぉ",
  "うぃ",
  "うぇ",
  "うぉ",
  "ヴぁ",
  "ヴぃ",
  "ヴぇ",
  "ヴぉ",
  "つぁ",
  "つぃ",
  "つぇ",
  "つぉ",
  "てゅ",
  "でゅ",
  "とぅ",
  "どぅ",
  "ふゅ",
];

/**
 * Split a text into an array of moras.
 * @param text Text.
 * @returns Array of moras.
 */
export function splitByMora(text: string): Mora[] {
  const moras: string[] = [];
  let i = 0;

  while (i < text.length) {
    // Check two-character mora.
    if (i + 1 < text.length) {
      const twoChars = text.slice(i, i + 2);
      if (TWO_CHARS_MORAS.includes(twoChars)) {
        moras.push(twoChars);
        i += 2;
        continue;
      }
    }

    // Add single-character mora.
    moras.push(text[i]);
    i++;
  }

  return moras;
}

export const moraPitchSchema = z.union([z.literal("H"), z.literal("L")]);

/**
 * Pitch accent.
 *
 * "H" stands for high pitch and "L" stands for low pitch.
 */
export type MoraPitch = z.infer<typeof moraPitchSchema>;

export const DEFAULT_MORA_PITCH: MoraPitch = "L";
