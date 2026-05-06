// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { type AuthGateway, AuthServerError } from "@/gateways/auth";

export function useAnonymousSignIn(authGateway: AuthGateway) {
  const isAuthenticatingRef = useRef(false);

  useEffect(() => {
    // Skip if it is going to authenticate, to avoid multiple simultaneous
    // authentication attempts.
    if (isAuthenticatingRef.current) {
      return;
    }

    (async () => {
      const currentUserId = authGateway.getCurrentUserId();
      if (currentUserId) {
        return;
      }

      isAuthenticatingRef.current = true;

      try {
        const newUserId = await authGateway.signInAnonymously();
        if (!newUserId) {
          throw new Error("Could not get user ID after signing in anonymously");
        }
      } catch (error: unknown) {
        if (error instanceof AuthServerError) {
          console.error("Failed to sign in anonymously", error.innerError);
        } else {
          console.error("Failed to sign in anonymously", error);
        }
        toast.error(
          "ユーザー認証に失敗しました。地点の投稿や編集ができません。"
        );
      } finally {
        isAuthenticatingRef.current = false;
      }
    })();
  }, [authGateway]);
}
