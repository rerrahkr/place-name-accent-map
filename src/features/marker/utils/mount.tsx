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
import type { PlaceNameData } from "@/models/place";
import { useMapStore } from "@/stores";
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
  isLiked: boolean;
  likeCount: number;
};

type MountOptionEditMode = {
  mode: "edit";

  /**
   * Callback function called when the marker is saved.
   * @param id Marker ID.
   * @param data Place name data.
   * @returns Promise of boolean which represents the result of some process.
   *          When this returns `false`, proceeding process is cancelled.
   */
  onSave: (id: string, data: PlaceNameData) => Promise<boolean>;
};

type MountOptions = MountOptionsDisplayMode | MountOptionEditMode;

/**
 * Mount a popup to the given marker.
 * @param marker A marker to mount the popup.
 * @param portalManager Manager of portal popup content elements.
 * @param onLike Function which is called in toggling the like button. Marker
 *               ID and the current like button state are give as arguments.
 *               Return value is the result of callback process.
 * @param onReport Function which is called in reporting.
 *                 Marker ID and report data are given as arguments.
 * @param options Mount options. It depends on`options.mode`.
 */
export function mountMarkerPopup(
  marker: Leaflet.Marker,
  portalManager: PopupPortalManager,
  onLike: (id: string, isLiked: boolean) => Promise<boolean>,
  onReport: (id: string, reportData: ReportData) => void,
  options: MountOptions
) {
  const isEditable = options.mode === "edit";
  const onSave = isEditable ? options.onSave : undefined;
  const popupId = isEditable ? newId() : options.id;
  const nameData = isEditable ? undefined : options.nameData;
  const isLiked = isEditable ? false : options.isLiked;
  const likeCount = isEditable ? 0 : options.likeCount;

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

  async function handleSave(data: PlaceNameData): Promise<boolean> {
    if (onSave === undefined) {
      return false;
    }

    if ((await onSave(popupId, data)) === false) {
      return false;
    }

    useMapStore.getState().finishEditing();

    const popup = marker.getPopup();
    if (popup) {
      popup.options.closeOnClick = true;
    }

    return true;
  }

  portalManager.addPortal({
    id: popupId,
    container: popupElement,
    content: (
      <MarkerPopup
        defaultNameData={nameData}
        initiallyEditing={isEditable}
        onSave={handleSave}
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
