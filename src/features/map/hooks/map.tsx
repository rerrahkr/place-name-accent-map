// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import type * as Leaflet from "leaflet";
import { useEffect, useEffectEvent, useRef } from "react";
import { toast } from "sonner";
import type { MountMarkerPopup } from "@/features/marker";
import { explainDeleteReason, type ReportData } from "@/features/report";
import {
  createPlaceData,
  type PlaceNameData,
  togglePlaceDataLike,
} from "@/models/place";
import type { PlaceRepository } from "@/repositories/place-repository";
import { useMapStore } from "@/stores";

// TODO: can exportable?
export async function loadLeaflet(): Promise<typeof Leaflet> {
  // Dynamically import Leaflet and plugin
  const L = (await import("leaflet")).default;

  // Plugin uses the global L variable, so we need to set it on `window`
  // biome-ignore lint/suspicious/noExplicitAny: no need to strictly type window.L
  (window as any).L = L;

  await import("leaflet-contextmenu");

  return L;
}

const MARKER_HIDE_ZOOM_THRESHOLD = 13;

// TODO: My user ID.
const currentUserId = "hogefugapiyo";

export function useMap(
  repository: PlaceRepository,
  mountMarkerPopup: MountMarkerPopup
) {
  const mapRef = useRef<Leaflet.Map | null>(null);
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const markerLayerShownRef = useRef<boolean>(false);
  const displayedMarkerIds = useRef<Set<string>>(new Set<string>());

  const handleLike = useEffectEvent(
    async (id: string, isLiked: boolean): Promise<boolean> => {
      try {
        const place = await repository.getPlace(id);
        if (place === undefined) {
          throw new Error();
        }

        const newData = togglePlaceDataLike(place, currentUserId);
        await repository.updatePlace(newData);

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
      const newPlace = createPlaceData(
        id,
        latLng.lat,
        latLng.lng,
        nameData,
        currentUserId
      );

      try {
        await repository.addPlace(newPlace);
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
        contextmenuWidth: 180,
        contextmenuItems: [
          {
            text: "この地点の地名と発音を登録",
            callback: addMarker,
            disabled: false,
          },
        ],
      }).setView([35.681236, 139.767125], 16);

      map.on("contextmenu.show", () => {
        map.contextmenu.setDisabled(
          0,
          useMapStore.getState().editingPopupId !== undefined
        );
      });
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Initialize marker layer
      const markerLayer = L.featureGroup();

      function addMarker(ev: Leaflet.ContextMenuItemClickEvent) {
        if (useMapStore.getState().editingPopupId !== undefined) {
          console.error(
            "Could not create new marker because other marker is editing"
          );
          return;
        }

        const marker = L.marker(ev.latlng).addTo(markerLayer);
        mountMarkerPopup(marker, handleLike, handleReport, {
          mode: "edit",
          onSave: async (id, nameData) =>
            await handleSave(id, ev.latlng, nameData),
        });
      }

      async function updateDisplayedMarkers() {
        // Add existing markers which exist within displayed bounds.
        const leafletBounds = map.getBounds();
        const placesInBounds = await repository.getPlaces({
          north: leafletBounds.getNorth(),
          south: leafletBounds.getSouth(),
          east: leafletBounds.getEast(),
          west: leafletBounds.getWest(),
        });

        for (const { id, coordinate, nameData, likedUsers } of placesInBounds) {
          if (displayedMarkerIds.current.has(id)) {
            continue;
          }

          const marker = L.marker([
            coordinate.latitude,
            coordinate.longitude,
          ]).addTo(markerLayer);
          mountMarkerPopup(marker, handleLike, handleReport, {
            mode: "display",
            id,
            nameData,
            isLiked: likedUsers.includes(currentUserId),
            likeCount: likedUsers.length,
          });

          displayedMarkerIds.current.add(id);
        }
      }

      await updateDisplayedMarkers();

      map.on("moveend", async () => {
        await updateDisplayedMarkers();
      });

      map.on("zoomend", async () => {
        // Display markers based on zoom level.
        const zoomRate = map.getZoom();
        if (zoomRate < MARKER_HIDE_ZOOM_THRESHOLD) {
          if (map.hasLayer(markerLayer)) {
            map.removeLayer(markerLayer);
            markerLayerShownRef.current = false;
          }
        } else {
          await updateDisplayedMarkers();

          if (!map.hasLayer(markerLayer)) {
            markerLayer.addTo(map);
            markerLayerShownRef.current = true;
          }
        }
      });

      if (map.getZoom() >= MARKER_HIDE_ZOOM_THRESHOLD) {
        markerLayer.addTo(map);
        markerLayerShownRef.current = true;
      }
    })();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [repository, mountMarkerPopup]);

  return { mapElementRef };
}
