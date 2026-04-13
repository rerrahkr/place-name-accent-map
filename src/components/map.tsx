// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import * as Leaflet from "leaflet";
import type React from "react";
import { useEffect, useEffectEvent, useRef } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-contextmenu/dist/leaflet.contextmenu.min.css";
import { toast } from "sonner";
import { mountMarkerPopup } from "@/features/marker";
import type { ReportData } from "@/features/report/types";
import { useMapStore } from "@/stores";
import type { PlaceData, PlaceNameData } from "@/types";

// Complete type definitions not present in @types/leaflet-contextmenu
declare module "leaflet" {
  interface MapOptions {
    contextmenuWidth?: number | undefined;
  }
}

async function loadLeaflet(): Promise<typeof Leaflet> {
  // Dynamically import Leaflet and plugin
  const L = (await import("leaflet")).default;

  // Plugin uses the global L variable, so we need to set it on `window`
  // biome-ignore lint/suspicious/noExplicitAny: no need to strictly type window.L
  (window as any).L = L;

  await import("leaflet-contextmenu");

  return L;
}

// TODO: Load on first launch and cache the data
const placeDataList: PlaceData[] = [
  {
    latLng: Leaflet.latLng(35.681236, 139.767125),
    nameData: {
      spelling: "東京",
      moras: ["と", "ー", "きょ", "ー"],
      pitches: ["L", "H", "H", "H"],
    },
  },
  {
    latLng: Leaflet.latLng(35.689957, 139.700507),
    nameData: {
      spelling: "新宿",
      moras: ["し", "ん", "じゅ", "く"],
      pitches: ["L", "H", "H", "H"],
    },
  },
];

function useMap() {
  const mapRef = useRef<Leaflet.Map | null>(null);
  const mapElementRef = useRef<HTMLDivElement | null>(null);

  const handleLike = useEffectEvent(() => {
    console.log("toddle like");
  });

  const handleReport = useEffectEvent(({ id, reason }: ReportData) => {
    console.log(`Accept deletion request "${id}": ${reason}`);

    toast.success(`削除依頼を受け付けました`);
  });

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length === 0) {
        return;
      }

      mapRef.current?.invalidateSize();
    });

    if (mapElementRef.current) {
      resizeObserver.observe(mapElementRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const handleSave = useEffectEvent(
    (latLng: Leaflet.LatLng, nameData: PlaceNameData) => {
      console.log(`nameData: ${nameData}`);
      placeDataList.push({ latLng, nameData });
    }
  );

  useEffect(() => {
    const container = mapElementRef.current;
    if (!container || mapRef.current) {
      return;
    }

    (async () => {
      const L = await loadLeaflet();

      if (mapRef.current) {
        return;
      }

      // Initialize the map
      const map = L.map(container, {
        contextmenu: true,
        contextmenuWidth: 140,
        contextmenuItems: [
          {
            text: "Add New Marker",
            callback: addMarker,
          },
        ],
      }).setView([35.681236, 139.767125], 15);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Initialize marker layer
      const markerLayer = L.featureGroup();

      function addMarker(ev: Leaflet.ContextMenuItemClickEvent) {
        if (useMapStore.getState().isEditing) {
          console.log(
            "Could not create new marker because other marker is editing"
          );
          return;
        }

        const marker = L.marker(ev.latlng).addTo(markerLayer);
        mountMarkerPopup(marker, handleLike, handleReport, {
          onSave: (nameData) => handleSave(ev.latlng, nameData),
        });
      }

      // Add existing markers
      for (const placeData of placeDataList) {
        const marker = L.marker(placeData.latLng).addTo(markerLayer);
        mountMarkerPopup(marker, handleLike, handleReport, {
          defaultNameData: placeData.nameData,
        });
      }

      markerLayer.addTo(map);
    })();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return { mapElementRef };
}

type MapComponentProps = {
  className?: string;
  style?: React.CSSProperties;
};

export function MapComponent({
  className,
  style,
}: MapComponentProps): React.JSX.Element {
  const { mapElementRef } = useMap();

  return <div ref={mapElementRef} className={className} style={style} />;
}
