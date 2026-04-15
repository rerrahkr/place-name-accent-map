// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import "leaflet/dist/leaflet.css";
import "leaflet-contextmenu/dist/leaflet.contextmenu.min.css";
import type * as Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-contextmenu/dist/leaflet.contextmenu.min.css";
import type React from "react";
import type { ReportData } from "@/features/report/types";
import { useMapStore } from "@/stores";
import type { PlaceNameData } from "@/types";
import { MarkerPopup } from "../components/marker-popup";

type PopupPortalEntry = {
  id: string;
  container: HTMLDivElement;
  content: React.ReactNode;
};

type PopupPortalManager = {
  addPortal: (portal: PopupPortalEntry) => void;
  removePortal: (id: string) => void;
};

type MountOptions = {
  /** Default info for the marker popup */
  defaultNameData?: PlaceNameData | undefined;
  /**
   * Callback function called when the marker is saved.
   * If undefined, the popup will be in read-only mode.
   */
  onSave?: (data: PlaceNameData) => void;

  likeInfo?: {
    count: number;
    isLiked: boolean;
  };
};

/**
 * Mount a popup to the given marker.
 * @param marker A marker to mount the popup.
 * @param options Mount options.
 */
export function mountMarkerPopup(
  marker: Leaflet.Marker,
    portalManager: PopupPortalManager,
  onLike: () => void,
  onReport: (reportData: ReportData) => void,
  options: MountOptions = {}
) {
  const { defaultNameData, onSave, likeInfo } = options;
  const { count: likeCount = 0, isLiked = false } = likeInfo ?? {};
  const isEditable = !!onSave;

  const popupElement = document.createElement("div");
  const popupId =
    crypto.randomUUID?.() ??
    `marker-popup-${Math.random().toString(36).slice(2)}`;
  let isUnmounted = false;

  function cleanupPopupPortal() {
    if (isUnmounted) {
      return;
    }

    isUnmounted = true;
    portalManager.removePortal(popupId);
  }

  function removeMarker() {
    marker.remove();
    useMapStore.getState().finishEditing();
    cleanupPopupPortal();
  }

  portalManager.addPortal({
    id: popupId,
    container: popupElement,
    content: (
      <MarkerPopup
        defaultNameData={defaultNameData}
        initiallyEditing={isEditable}
        onSave={(data) => {
          useMapStore.getState().finishEditing();
          onSave?.(data);

          const popup = marker.getPopup();
          if (popup) {
            popup.options.closeOnClick = true;
          }
        }}
        onCancel={removeMarker}
        likeCount={likeCount}
        isLiked={isLiked}
        onLike={onLike}
        onReport={onReport}
      />
    ),
  });

  marker.bindPopup(popupElement, {
    className: "marker-popup",
    closeButton: false,
    closeOnClick: !isEditable,
  });

  marker.on("popupclose", () => {
    if (useMapStore.getState().editingPopupId === popupId) {
      removeMarker();
    }
  });

  if (onSave !== undefined) {
    useMapStore.getState().startEditing(popupId);

    marker.openPopup();
  }
}
