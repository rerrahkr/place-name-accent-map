// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import type { useMarker } from "./hooks/marker";

export { useMarker } from "./hooks/marker";
export type MountMarkerPopup = ReturnType<typeof useMarker>["mountMarkerPopup"];
export type { PopupPortalEntry, PopupPortalManager } from "./types/portal";
