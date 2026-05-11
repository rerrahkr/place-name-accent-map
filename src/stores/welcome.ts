// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type WelcomeState = {
  isWelcomeDialogOpen: boolean;
  isFirstAccess: boolean;
};

type WelcomeActions = {
  changeOpenWelcomeDialogState: (isOpen: boolean) => void;
  setFirstAccess: (isFirstAccess: boolean) => void;
};

export const useWelcomeStore = create<WelcomeState & WelcomeActions>()(
  persist(
    immer((set) => ({
      isWelcomeDialogOpen: false,
      isFirstAccess: true,

      changeOpenWelcomeDialogState: (isOpen) => {
        set((state) => {
          state.isWelcomeDialogOpen = isOpen;
        });
      },

      setFirstAccess: (isFirstAccess) => {
        set((state) => {
          state.isFirstAccess = isFirstAccess;
        });
      },
    })),
    {
      name: "welcome-store",
    }
  )
);
