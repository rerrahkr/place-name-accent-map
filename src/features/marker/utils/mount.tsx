// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import "leaflet/dist/leaflet.css";
import "leaflet-contextmenu/dist/leaflet.contextmenu.min.css";
import type * as Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-contextmenu/dist/leaflet.contextmenu.min.css";
import { createRoot } from "react-dom/client";
import type { ReportData } from "@/features/report/types";
import { useMapStore } from "@/stores";
import type { PlaceNameData } from "@/types";
import { MarkerPopup } from "../components/marker-popup";

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
  onLike: () => void,
  onReport: (reportData: ReportData) => void,
  options: MountOptions = {}
) {
  const { defaultNameData, onSave, likeInfo } = options;
  const { count: likeCount = 0, isLiked = false } = likeInfo ?? {};

  const popupElement = document.createElement("div");
  const popupRoot = createRoot(popupElement);

  function removeMarker() {
    marker.remove();

    useMapStore.getState().finishEditing();

    // Wait unmounting until the popup close animation is finished
    setTimeout(() => {
      popupRoot.unmount();
    }, 500);
  }

  popupRoot.render(
    <MarkerPopup
      defaultNameData={defaultNameData}
      initiallyEditing={onSave !== undefined}
      onSave={(data) => {
        useMapStore.getState().finishEditing();
        onSave?.(data);
      }}
      onCancel={removeMarker}
      likeCount={likeCount}
      isLiked={isLiked}
      onLike={onLike}
      onReport={onReport}
    />
  );

  marker.bindPopup(popupElement, {
    className: "marker-popup",
    closeButton: false,
  });

  marker.on("popupclose", () => {
    if (useMapStore.getState().isEditing) {
      removeMarker();
    }
  });

  if (onSave !== undefined) {
    useMapStore.getState().startEditing();

    marker.openPopup();
  }
}
