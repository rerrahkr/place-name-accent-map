// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import type { MoraPitch } from "@/utils/mora";

export type MarkerAccent = {
  spelling: string;
  moras: string[];
  pitches: MoraPitch[];
};
