// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import type * as Leaflet from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png?url";
import markerIconRetina from "leaflet/dist/images/marker-icon-2x.png?url";
import markerShadow from "leaflet/dist/images/marker-shadow.png?url";
import "leaflet/dist/leaflet.css";
import "leaflet-contextmenu/dist/leaflet.contextmenu.min.css";

let L: typeof Leaflet | undefined;

export async function getL(): Promise<typeof Leaflet> {
  if (L !== undefined) {
    return L;
  }

  // Dynamically import Leaflet and plugin
  L = (await import("leaflet")).default;

  // Fix default icon paths for both dev and production builds
  // biome-ignore lint/suspicious/noExplicitAny: Reset icons
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIconRetina,
    shadowUrl: markerShadow,
  });

  // Plugin uses the global L variable, so we need to set it on `window`
  // biome-ignore lint/suspicious/noExplicitAny: no need to strictly type window.L
  (window as any).L = L;

  await import("leaflet-contextmenu");

  return L;
}
