// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import type { UserId } from "@/models/user";

export type AuthGateway = {
  getCurrentUserId: () => UserId | undefined;
  onChangeUserId: (
    callback: (userId: UserId | undefined) => void
  ) => () => void;
  signInAnonymously: () => Promise<UserId>;
};
