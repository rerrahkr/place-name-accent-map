// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import type React from "react";
import { createPortal } from "react-dom";
import "leaflet/dist/leaflet.css";
import "leaflet-contextmenu/dist/leaflet.contextmenu.min.css";
import { useMarker } from "@/features/marker/hooks/marker";
import { WelcomeDialog } from "@/features/welcome";
import type { PlaceRepository } from "@/repositories/place";
import type { ReportRepository } from "@/repositories/report";
import { useMap } from "../hooks/map";

type MapComponentProps = {
  placeRepository: PlaceRepository;
  reportRepository: ReportRepository;
  className?: string;
  style?: React.CSSProperties;
};

export function MapComponent({
  placeRepository,
  reportRepository,
  className,
  style,
}: MapComponentProps): React.JSX.Element {
  const { popupPortals, mountMarkerPopup } = useMarker();
  const { mapElementRef } = useMap(
    placeRepository,
    reportRepository,
    mountMarkerPopup
  );

  return (
    <>
      <WelcomeDialog />
      <div ref={mapElementRef} className={className} style={style} />
      {popupPortals.map(({ id, container, content }) =>
        createPortal(content, container, id)
      )}
    </>
  );
}
