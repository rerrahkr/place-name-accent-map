// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import type * as Leaflet from "leaflet";

let L: typeof Leaflet | undefined;

export async function getL(): Promise<typeof Leaflet> {
  if (L !== undefined) {
    return L;
  }

  // Dynamically import Leaflet and plugin
  L = (await import("leaflet")).default;

  // Plugin uses the global L variable, so we need to set it on `window`
  // biome-ignore lint/suspicious/noExplicitAny: no need to strictly type window.L
  (window as any).L = L;

  await import("leaflet-contextmenu");

  return L;
}
