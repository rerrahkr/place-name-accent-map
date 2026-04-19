// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import type * as Leaflet from "leaflet";
import type React from "react";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "leaflet/dist/leaflet.css";
import "leaflet-contextmenu/dist/leaflet.contextmenu.min.css";
import { toast } from "sonner";
import { mountMarkerPopup } from "@/features/marker";
import { explainDeleteReason } from "@/features/report";
import type { ReportData } from "@/features/report/types";
import type { PlaceRepository } from "@/repositories/place-repository";
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

type PopupPortalEntry = {
  /** The same value as the place data's ID.  */
  id: string;
  container: HTMLDivElement;
  content: React.ReactNode;
};

function useMap(repository: PlaceRepository) {
  const mapRef = useRef<Leaflet.Map | null>(null);
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const [popupPortals, setPopupPortals] = useState<PopupPortalEntry[]>([]);
  const [_places, setPlaces] = useState<PlaceData[]>([]);

  const addPopupPortal = useEffectEvent((entry: PopupPortalEntry) => {
    setPopupPortals((previous) => [...previous, entry]);
  });

  const removePopupPortal = useEffectEvent((id: string) => {
    setPopupPortals((previous) => previous.filter((entry) => entry.id !== id));
  });

  const handleLike = useEffectEvent(
    async (id: string, isLiked: boolean): Promise<boolean> => {
      try {
        await repository.toggleLike(id);

        setPlaces((prevPlaces) =>
          prevPlaces.map((place) =>
            place.id === id
              ? {
                  ...place,
                  likeInfo: {
                    count: place.likeInfo.count + (isLiked ? 1 : -1),
                    isLiked,
                  },
                }
              : place
          )
        );

        return true;
      } catch (e: unknown) {
        console.error(
          `Failed to toggle like ${isLiked ? "on" : "off"}: "${id}"\n${JSON.stringify(e)}`
        );
        toast.error("操作に失敗しました");

        return false;
      }
    }
  );

  const handleReport = useEffectEvent((id: string, { reason }: ReportData) => {
    console.log(`Accept deletion request "${id}": ${reason}`);

    toast.success(`削除依頼を受け付けました`, {
      description: explainDeleteReason(reason),
    });
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
    async (
      id: string,
      latLng: Leaflet.LatLng,
      nameData: PlaceNameData
    ): Promise<boolean> => {
      const newPlace: PlaceData = {
        id,
        latLng,
        nameData,
        likeInfo: {
          count: 0,
          isLiked: false,
        },
      };

      try {
        await repository.addPlace(newPlace);
        setPlaces((prev) => [...prev, newPlace]);
        return true;
      } catch (e: unknown) {
        console.error(
          `Failed to add: ${JSON.stringify(newPlace)}\n${JSON.stringify(e)}`
        );
        toast.error("地名の発音の登録に失敗しました");
        return false;
      }
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

      const portalManager = {
        addPortal: addPopupPortal,
        removePortal: removePopupPortal,
      };

      function addMarker(ev: Leaflet.ContextMenuItemClickEvent) {
        if (useMapStore.getState().editingPopupId !== undefined) {
          console.error(
            "Could not create new marker because other marker is editing"
          );
          return;
        }

        const marker = L.marker(ev.latlng).addTo(markerLayer);
        mountMarkerPopup(marker, portalManager, handleLike, handleReport, {
          mode: "edit",
          onSave: async (id, nameData) =>
            await handleSave(id, ev.latlng, nameData),
        });
      }

      // Load places.
      const loadedPlaces = await repository.getPlaces();
      setPlaces(loadedPlaces);

      // Add existing markers
      for (const { id, latLng, nameData, likeInfo } of loadedPlaces) {
        const marker = L.marker(latLng).addTo(markerLayer);
        mountMarkerPopup(marker, portalManager, handleLike, handleReport, {
          mode: "display",
          id,
          nameData,
          likeInfo,
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
  }, [repository]);

  return { mapElementRef, popupPortals };
}

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
  const { mapElementRef, popupPortals } = useMap(repository);

  return (
    <>
      <div ref={mapElementRef} className={className} style={style} />
      {popupPortals.map(({ id, container, content }) =>
        createPortal(content, container, id)
      )}
    </>
  );
}
