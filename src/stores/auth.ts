// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { UserId } from "@/models/user";

type AuthState = {
  currentUserId: UserId | undefined;
};

type AuthActions = {
  setCurrentUserId: (userId: UserId | undefined) => void;
};

export const useAuthStore = create<AuthState & AuthActions>()(
  immer((set) => ({
    currentUserId: undefined,

    setCurrentUserId: (userId: UserId | undefined) => {
      set((state) => {
        state.currentUserId = userId;
      });
    },
  }))
);
