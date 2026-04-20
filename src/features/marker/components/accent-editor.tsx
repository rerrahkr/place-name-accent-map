// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import type React from "react";
import type { Mora, MoraPitch } from "@/models/mora";
import { AccentRenderer } from "./accent-renderer";

type AccentEditorProps = {
  moras: Mora[];
  pitches: MoraPitch[];
  onPitchChange: (index: number, pitch: MoraPitch) => void;
};

export function AccentEditor({
  moras,
  pitches,
  onPitchChange,
}: AccentEditorProps): React.JSX.Element {
  if (moras.length === 0) {
    return (
      <div className="text-muted-foreground text-sm py-4 text-center">
        読みを入力するとアクセントを設定できます
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs text-muted-foreground mb-1">
        各モーラをクリックして高低を切り替えてください
      </div>
      <AccentRenderer
        moras={moras}
        pitches={pitches}
        onPitchChange={onPitchChange}
      />
    </div>
  );
}
