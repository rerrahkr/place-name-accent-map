// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import type React from "react";
import { cn } from "@/lib/utils";
import { DEFAULT_MORA_PITCH, type MoraPitch } from "@/utils/mora";

type AccentEditorProps = {
  moras: string[];
  pitches: MoraPitch[];
  onPitchChange?: ((index: number, pitch: MoraPitch) => void) | undefined;
};

export function AccentRenderer({
  moras,
  pitches,
  onPitchChange,
}: AccentEditorProps): React.JSX.Element | null {
  if (moras.length === 0 || moras.length !== pitches.length) {
    return null;
  }

  const isEditable = !!onPitchChange;

  function togglePitch(index: number) {
    const newPitch: MoraPitch = pitches[index] === "H" ? "L" : "H";
    onPitchChange?.(index, newPitch);
  }

  return (
    <div className="flex flex-wrap gap-1">
      {moras.map((mora, index) => {
        const pitch = pitches[index] ?? DEFAULT_MORA_PITCH;
        const isHigh = pitch === "H";
        const nextPitch = pitches[index + 1] ?? DEFAULT_MORA_PITCH;
        const isChanging = pitch !== nextPitch;

        return (
          <button
            key={`${moras.slice(0, index + 1).join("")}`}
            type="button"
            onClick={isEditable ? () => togglePitch(index) : undefined}
            className={cn(
              "relative flex flex-col items-center justify-center min-w-10",
              "h-16 px-2 rounded-md border-2 select-none",
              isHigh
                ? "bg-pitch-high-bg border-pitch-high text-pitch-high"
                : "bg-pitch-low-bg border-pitch-low text-pitch-low",
              isEditable && [
                "cursor-pointer transition-all duration-200",
                "hover:scale-105 active:scale-95",
              ]
            )}
          >
            {/* High / Low label */}
            <span
              className={cn(
                "text-[10px] font-bold",
                isHigh ? "mb-auto mt-1" : "mt-auto mb-1"
              )}
            >
              {isHigh ? "高" : "低"}
            </span>

            {/* Mora text */}
            <span className="text-lg font-medium absolute top-1/2 -translate-y-1/2">
              {mora}
            </span>

            {/* Pitch connection line */}
            {index < moras.length - 1 && (
              <div
                className={cn(
                  "absolute -right-[4px] translate-x-1/2 origin-center h-[2px] z-10",
                  !isChanging && [
                    "w-[8px]",
                    isHigh
                      ? "top-[12px] bg-pitch-high"
                      : "top-[52px] bg-pitch-low",
                  ],
                  isChanging && [
                    "w-[11.31px] top-[32px] -mt-[1px]",
                    isHigh
                      ? "rotate-45 bg-linear-to-r from-pitch-high to-pitch-low"
                      : "-rotate-45 bg-linear-to-r from-pitch-low to-pitch-high",
                  ]
                )}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
