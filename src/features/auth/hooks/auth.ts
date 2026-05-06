// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { useEffect } from "react";
import type { AuthGateway } from "@/gateways/auth";
import { useAuthStore } from "@/stores/auth";

export function useAuth(authGateway: AuthGateway) {
  const setCurrentUserId = useAuthStore((state) => state.setCurrentUserId);

  useEffect(() => {
    return authGateway.onChangeUserId(setCurrentUserId);
  }, [authGateway, setCurrentUserId]);
}
