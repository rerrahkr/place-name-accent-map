// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import type * as Leaflet from "leaflet";
import { useCallback } from "react";
import type { ReportData } from "@/features/report";
import {
  createNewPlaceId,
  type PlaceId,
  type PlaceNameData,
} from "@/models/place";
import { useMapStore } from "@/stores/edit";
import { MarkerPopup } from "../components/marker-popup";
import { usePopupPortal } from "./popup";

type MountOptionsDisplayMode = {
  mode: "display";

  /** Marker ID. */
  id: PlaceId;
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
  onSave: (id: PlaceId, data: PlaceNameData) => Promise<boolean>;
};

type MountOptions = MountOptionsDisplayMode | MountOptionEditMode;

export function useMarker() {
  const { popupPortals, portalManager } = usePopupPortal();

  /**
   * Mount a popup to the given marker.
   * @param marker A marker to mount the popup.
   * @param onLike Function which is called in toggling the like button. Marker
   *               ID and the current like button state are give as arguments.
   *               Return value is the result of callback process.
   * @param onReport Function which is called in reporting.
   *                 Marker ID and report data are given as arguments.
   * @param options Mount options. It depends on`options.mode`.
   */
  const mountMarkerPopup = useCallback(
    (
      marker: Leaflet.Marker,
      onLike: (id: PlaceId, isLiked: boolean) => Promise<boolean>,
      onReport: (id: PlaceId, reportData: ReportData) => void,
      options: MountOptions
    ) => {
      const isEditable = options.mode === "edit";
      const onSave = isEditable ? options.onSave : undefined;
      const popupId = isEditable ? createNewPlaceId() : options.id;
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
    },
    [portalManager]
  );

  return { popupPortals, mountMarkerPopup };
}
