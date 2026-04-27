// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import "leaflet";

// Complete type definitions not present in @types/leaflet-contextmenu
declare module "leaflet" {
  interface Map {
    contextmenu: {
      setDisabled: (index: number, disabled: boolean) => void;
    };
  }

  interface MapOptions {
    contextmenuWidth?: number | undefined;
  }
}
