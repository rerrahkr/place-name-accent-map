// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { createUserId, type UserId } from "@/models/user";
import type { AuthGateway } from "./auth-gateway";

let userId: UserId | undefined;
let onChangedCallback: Parameters<AuthGateway["onChangeUserId"]>[0] | undefined;

export const authGateway: AuthGateway = {
  getCurrentUserId: () => {
    return userId;
  },

  onChangeUserId: (callback) => {
    onChangedCallback = callback;
    return () => {};
  },

  signInAnonymously: async () => {
    if (!userId) {
      userId = createUserId("hoge");
      onChangedCallback?.(userId);
    }
    return userId;
  },
} as const;
