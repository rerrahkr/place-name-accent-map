// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import "leaflet/dist/leaflet.css";
import "leaflet-contextmenu/dist/leaflet.contextmenu.min.css";
import type * as Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-contextmenu/dist/leaflet.contextmenu.min.css";
import type React from "react";
import type { ReportData } from "@/features/report/types";
import { newId } from "@/lib/utils";
import { useMapStore } from "@/stores";
import type { LikeInfo, PlaceNameData } from "@/types";
import { MarkerPopup } from "../components/marker-popup";

type PopupPortalEntry = {
  /** Portal entry ID. */
  id: string;
  /** Portal DOM element container. */
  container: HTMLDivElement;
  /** Portal content node. */
  content: React.ReactNode;
};

/** Interface of portal manager for popup contents. */
type PopupPortalManager = {
  /**
   * Add a given portal entry to management targets.
   * @param portal Portal entry.
   */
  addPortal: (portal: PopupPortalEntry) => void;

  /**
   * Remove portal entry from management targets.
   * @param id ID of the portal entry to be deleted.
   */
  removePortal: (id: string) => void;
};

type MountOptionsDisplayMode = {
  mode: "display";

  /** Marker ID. */
  id: string;
  nameData: PlaceNameData;
  likeInfo: LikeInfo;
};

type MountOptionEditMode = {
  mode: "edit";

  /**
   * Callback function called when the marker is saved.
   * @param id Marker ID.
   * @param data Place name data.
   */
  onSave: (id: string, data: PlaceNameData) => void;
};

type MountOptions = MountOptionsDisplayMode | MountOptionEditMode;

/**
 * Mount a popup to the given marker.
 * @param marker A marker to mount the popup.
 * @param portalManager Manager of portal popup content elements.
 * @param onLike Function which is called in toggling the like button. Marker
 *               ID and the current like button state are give as arguments.
 * @param onReport Function which is called in reporting.
 *                 Marker ID and report data are given as arguments.
 * @param options Mount options. It depends on`options.mode`.
 */
export function mountMarkerPopup(
  marker: Leaflet.Marker,
  portalManager: PopupPortalManager,
  onLike: (id: string, isLiked: boolean) => void,
  onReport: (id: string, reportData: ReportData) => void,
  options: MountOptions
) {
  const isEditable = options.mode === "edit";
  const onSave = isEditable ? options.onSave : undefined;
  const popupId = isEditable ? newId() : options.id;
  const nameData = isEditable ? undefined : options.nameData;
  const { count: likeCount = 0, isLiked = false } = isEditable
    ? {}
    : options.likeInfo;

  const popupElement = document.createElement("div");
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
        defaultNameData={nameData}
        initiallyEditing={isEditable}
        onSave={(data) => {
          useMapStore.getState().finishEditing();
          onSave?.(popupId, data);

          const popup = marker.getPopup();
          if (popup) {
            popup.options.closeOnClick = true;
          }
        }}
        onCancel={removeMarker}
        likeCount={likeCount}
        isLiked={isLiked}
        onLike={(liked) => onLike(popupId, liked)}
        onReport={(data) => onReport(popupId, data)}
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
