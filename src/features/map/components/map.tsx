// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import type React from "react";
import { createPortal } from "react-dom";
import "leaflet/dist/leaflet.css";
import "leaflet-contextmenu/dist/leaflet.contextmenu.min.css";
import { useMarker } from "@/features/marker/hooks/marker";
import type { PlaceRepository } from "@/repositories/place";
import { useMap } from "../hooks/map";

type MapComponentProps = {
  repository: PlaceRepository;
  className?: string;
  style?: React.CSSProperties;
};

export function MapComponent({
  repository,
  className,
  style,
}: MapComponentProps): React.JSX.Element {
  const { popupPortals, mountMarkerPopup } = useMarker();
  const { mapElementRef } = useMap(repository, mountMarkerPopup);

  return (
    <>
      <div ref={mapElementRef} className={className} style={style} />
      {popupPortals.map(({ id, container, content }) =>
        createPortal(content, container, id)
      )}
    </>
  );
}
