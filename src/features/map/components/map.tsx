// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import type React from "react";
import { createPortal } from "react-dom";
import { Spinner } from "@/components/ui/spinner";
import { useMarker } from "@/features/marker/hooks/marker";
import { cn } from "@/lib/utils";
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
  const { mapElementRef, hasInitialized } = useMap(
    placeRepository,
    reportRepository,
    mountMarkerPopup
  );

  return (
    <div className={cn(className, "relative")}>
      {/* Spinner overlay*/}
      <div
        className={cn(
          "absolute inset-0 z-3000 size-full bg-background",
          "flex flex-col items-center justify-center gap-4",
          "transition-all duration-500 ease-in-out",
          hasInitialized ? "opacity-0 invisible" : "opacity-100 visible"
        )}
      >
        <Spinner className="text-primary size-18" />
        <p className="text-primary text-lg">地図を読み込み中...</p>
      </div>

      {/* Map */}
      <div ref={mapElementRef} className="size-full" style={style} />
      {popupPortals.map(({ id, container, content }) =>
        createPortal(content, container, id)
      )}
    </div>
  );
}
