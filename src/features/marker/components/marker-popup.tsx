// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import type React from "react";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-contextmenu/dist/leaflet.contextmenu.min.css";
import "leaflet/dist/leaflet.css";
import "leaflet-contextmenu/dist/leaflet.contextmenu.min.css";
import type { ReportData } from "@/features/report/types";
import type { PlaceNameData } from "@/types";
import type { MoraPitch } from "@/utils/mora";
import { PlaceNameDisplay } from "./place-name-display";
import { PlaceNameEditor } from "./place-name-editor";

type MarkerPopupProps = {
  defaultNameData?: PlaceNameData | undefined;
  initiallyEditing?: boolean | undefined;
  onSave: (data: PlaceNameData) => void;
  onCancel: () => void;

  likeCount: number;
  isLiked: boolean;
  onLike: () => void;
  onReport: (reportData: ReportData) => void;
};

export function MarkerPopup({
  defaultNameData,
  initiallyEditing = true,
  onSave,
  onCancel,

  likeCount,
  isLiked,
  onLike,
  onReport,
}: MarkerPopupProps): React.JSX.Element {
  const [spelling, setSpelling] = useState<string>(
    defaultNameData?.spelling ?? ""
  );
  const [moras, setMoras] = useState<string[]>(defaultNameData?.moras ?? []);
  const [picthes, setPitches] = useState<MoraPitch[]>(
    defaultNameData?.pitches ?? []
  );

  const [hasSaved, setHasSaved] = useState<boolean>(!initiallyEditing);

  function handleSubmit(data: PlaceNameData) {
    setSpelling(data.spelling);
    setMoras(data.moras);
    setPitches(data.pitches);

    setHasSaved(true);

    onSave(data);
  }

  return (
    <div className="w-full max-w-xs py-0 space-y-2">
      {hasSaved ? (
        <PlaceNameDisplay
          spelling={spelling}
          moras={moras}
          pitches={picthes}
          likeCount={likeCount}
          isLiked={isLiked}
          onLike={onLike}
          onReport={onReport}
        />
      ) : (
        <PlaceNameEditor onSubmit={handleSubmit} onCancel={onCancel} />
      )}
    </div>
  );
}
