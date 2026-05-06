// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import type * as Leaflet from "leaflet";
import { useEffect, useEffectEvent, useRef } from "react";
import { toast } from "sonner";
import type { MountMarkerPopup } from "@/features/marker";
import { explainDeleteReason, type ReportData } from "@/features/report";
import { getL } from "@/lib/leaflet";
import { createCoordinate } from "@/models/coordinate";
import {
  createNewPlaceData,
  type PlaceId,
  togglePlaceDataLike,
} from "@/models/place";
import type { PlaceNameData } from "@/models/place-name";
import type { PlaceRepository } from "@/repositories/place";
import type { ReportRepository } from "@/repositories/report";
import { useAuthStore } from "@/stores/auth";
import { useMapStore } from "@/stores/edit";

const MARKER_HIDE_ZOOM_THRESHOLD = 13;

export function useMap(
  placeRepository: PlaceRepository,
  reportRepository: ReportRepository,
  mountMarkerPopup: MountMarkerPopup
) {
  const mapRef = useRef<Leaflet.Map | null>(null);
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const markerLayerShownRef = useRef<boolean>(false);
  const displayedMarkerIds = useRef<Set<PlaceId>>(new Set<PlaceId>());

  const currentUserId = useAuthStore((state) => state.currentUserId);

  const handleLike = useEffectEvent(
    async (id: PlaceId, isLiked: boolean): Promise<boolean> => {
      if (!currentUserId) {
        toast.error("ユーザー認証がされていないため操作できません。");
        return false;
      }

      try {
        const place = await placeRepository.getPlace(id);
        if (place === undefined) {
          throw new Error();
        }

        const newData = togglePlaceDataLike(place, currentUserId);
        await placeRepository.updatePlace(newData);

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

  const handleReport = useEffectEvent(
    async (id: PlaceId, reportData: ReportData) => {
      if (!currentUserId) {
        toast.error("ユーザー認証がされていないため操作できません。");
        return;
      }

      try {
        await reportRepository.addReport({
          placeId: id,
          userId: currentUserId,
          data: reportData,
        });

        toast.success(`削除依頼を受け付けました`, {
          description: explainDeleteReason(reportData.reason),
        });
      } catch (err: unknown) {
        console.error(`Failed to report "${id}": ${JSON.stringify(err)}`);
        toast.error("操作に失敗しました");
      }
    }
  );

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
      id: PlaceId,
      latLng: Leaflet.LatLng,
      nameData: PlaceNameData
    ): Promise<boolean> => {
      if (!currentUserId) {
        toast.error("ユーザー認証がされていないため操作できません。");
        return false;
      }

      const newPlace = createNewPlaceData(
        id,
        createCoordinate(latLng.lat, latLng.lng),
        nameData,
        currentUserId
      );

      try {
        await placeRepository.addPlace(newPlace);
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
    if (!currentUserId) {
      return;
    }

    const container = mapElementRef.current;
    if (!container || mapRef.current) {
      return;
    }

    (async () => {
      const L = await getL();

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
        if (!currentUserId) {
          return;
        }

        // Add existing markers which exist within displayed bounds.
        const leafletBounds = map.getBounds();
        const placesInBounds = await placeRepository.getPlaces({
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
  }, [placeRepository, mountMarkerPopup, currentUserId]);

  return { mapElementRef };
}
