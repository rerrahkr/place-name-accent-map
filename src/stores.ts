// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type MapState = {
  editingPopupId: string | undefined;
};

type MapActions = {
  startEditing: (popupId: string) => void;
  finishEditing: () => void;
};

export const useMapStore = create<MapState & MapActions>()(
  immer((set) => ({
    editingPopupId: undefined,

    startEditing: (popupId: string) =>
      set((state) => {
        state.editingPopupId = popupId;
      }),

    finishEditing: () =>
      set((state) => {
        state.editingPopupId = undefined;
      }),
  }))
);
