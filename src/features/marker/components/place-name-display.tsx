// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { FlagIcon, HeartIcon } from "lucide-react";
import { useState } from "react";
import { type ReportData, ReportDialog } from "@/features/report";
import { cn } from "@/lib/utils";
import type { MoraPitch } from "@/utils/mora";
import { AccentRenderer } from "./accent-renderer";

interface PlaceNameDisplayProps {
  spelling: string;
  moras: string[];
  pitches: MoraPitch[];
  likeCount: number;
  isLiked: boolean;
  onLike: () => void;
  onReport: (reportData: ReportData) => void;
}

export function PlaceNameDisplay({
  spelling,
  moras,
  pitches,
  likeCount,
  isLiked,
  onLike,
  onReport,
}: PlaceNameDisplayProps) {
  const [liked, setLiked] = useState<boolean>(isLiked);
  const [count, setCount] = useState<number>(likeCount);

  const [reportDialogOpened, setReportDialogOpend] = useState<boolean>(false);

  function handleLike() {
    if (liked) {
      setCount((prev) => prev - 1);
    } else {
      setCount((prev) => prev + 1);
    }
    setLiked((prev) => !prev);
    onLike();
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Spelling */}
        <h3 className="text-2xl font-bold text-foreground tracking-wide">
          {spelling}
        </h3>

        {/* Mora and accent */}
        <div className="flex flex-col gap-2">
          <span className="text-xs text-muted-foreground">
            読みとアクセント
          </span>
          <AccentRenderer moras={moras} pitches={pitches} />
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 pt-2 border-t border-border">
          {/* Like */}
          <button
            type="button"
            onClick={handleLike}
            className={cn(
              "flex items-center gap-1.5 text-sm transition-colors",
              liked
                ? "text-pink-500"
                : "text-muted-foreground hover:text-pink-500"
            )}
          >
            <HeartIcon
              className={cn(
                "size-5 transition-all",
                liked && "fill-current scale-110"
              )}
            />
            <span className="font-medium">{count}</span>
          </button>

          {/* Report */}
          <button
            type="button"
            onClick={() => setReportDialogOpend(true)}
            className={cn(
              "flex items-center gap-1.5 text-sm",
              "text-muted-foreground hover:text-destructive",
              "transition-colors"
            )}
          >
            <FlagIcon className="size-4" />
            <span>報告</span>
          </button>
        </div>
      </div>

      {/* TODO: Set proper ID */}
      <ReportDialog
        id="dummy"
        isOpen={reportDialogOpened}
        onOpenChange={setReportDialogOpend}
        onSubmitReport={onReport}
      />
    </>
  );
}
