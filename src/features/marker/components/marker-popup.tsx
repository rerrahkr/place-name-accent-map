// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import type React from "react";
import { useState } from "react";
import type { ReportData } from "@/features/report";
import type { Mora, MoraPitch } from "@/models/mora";
import type { PlaceNameData } from "@/models/place";
import { PlaceNameDisplay } from "./place-name-display";
import { PlaceNameEditor } from "./place-name-editor";

type MarkerPopupProps = {
  defaultNameData?: PlaceNameData | undefined;
  initiallyEditing?: boolean | undefined;
  onSave: (data: PlaceNameData) => Promise<boolean>;
  onCancel: () => void;
  likeCount: number;
  isLiked: boolean;
  onLike: (isLiked: boolean) => Promise<boolean>;
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
  const [moras, setMoras] = useState<Mora[]>(defaultNameData?.moras ?? []);
  const [pitches, setPitches] = useState<MoraPitch[]>(
    defaultNameData?.pitches ?? []
  );

  const [hasSaved, setHasSaved] = useState<boolean>(!initiallyEditing);

  async function handleSubmit(data: PlaceNameData): Promise<boolean> {
    if ((await onSave(data)) === false) {
      return false;
    }

    setSpelling(data.spelling);
    setMoras(data.moras);
    setPitches(data.pitches);

    setHasSaved(true);

    return true;
  }

  return (
    <div className="w-full max-w-xs py-0 space-y-2">
      {hasSaved ? (
        <PlaceNameDisplay
          spelling={spelling}
          moras={moras}
          pitches={pitches}
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
