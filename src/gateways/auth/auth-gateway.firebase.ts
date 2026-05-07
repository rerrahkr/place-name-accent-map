// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createUserId } from "@/models/user";
import type { AuthGateway } from "./auth-gateway";
import { AuthServerError } from "./errors";

export const authGateway: AuthGateway = {
  getCurrentUserId: () => {
    const user = auth.currentUser;
    return user ? createUserId(user.uid) : undefined;
  },

  onChangeUserId: (callback) => {
    return onAuthStateChanged(auth, (user) => {
      callback(user ? createUserId(user.uid) : undefined);
    });
  },

  signInAnonymously: async () => {
    try {
      const result = await signInAnonymously(auth);
      return createUserId(result.user.uid);
    } catch (error: unknown) {
      throw new AuthServerError(error);
    }
  },
};
