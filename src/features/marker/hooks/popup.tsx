// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { useCallback, useMemo, useState } from "react";
import type { PopupPortalEntry, PopupPortalManager } from "../types/portal";

export function usePopupPortal() {
  const [popupPortals, setPopupPortals] = useState<PopupPortalEntry[]>([]);

  const addPopupPortal = useCallback((entry: PopupPortalEntry) => {
    setPopupPortals((previous) => [...previous, entry]);
  }, []);

  const removePopupPortal = useCallback((id: string) => {
    setPopupPortals((previous) => previous.filter((entry) => entry.id !== id));
  }, []);

  const portalManager = useMemo<PopupPortalManager>(
    () => ({
      addPortal: addPopupPortal,
      removePortal: removePopupPortal,
    }),
    [addPopupPortal, removePopupPortal]
  );

  return { popupPortals, portalManager };
}
