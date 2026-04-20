// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { FlagIcon, HeartIcon } from "lucide-react";
import { startTransition, useOptimistic, useState } from "react";
import { type ReportData, ReportDialog } from "@/features/report";
import { cn } from "@/lib/utils";
import { toggleLike } from "@/models/like";
import type { Mora, MoraPitch } from "@/models/mora";
import { AccentRenderer } from "./accent-renderer";

type LikeDisplayState = {
  isLiked: boolean;
  count: number;
};

type PlaceNameDisplayProps = {
  spelling: string;
  moras: Mora[];
  pitches: MoraPitch[];
  likeCount: number;
  isLiked: boolean;
  onLike: (isLiked: boolean) => Promise<boolean>;
  onReport: (reportData: ReportData) => void;
};

export function PlaceNameDisplay({
  spelling,
  moras,
  pitches,
  likeCount,
  isLiked,
  onLike,
  onReport,
}: PlaceNameDisplayProps) {
  const [likeDisplayState, setLikeDisplayState] = useState<LikeDisplayState>({
    isLiked,
    count: likeCount,
  });
  const [optimisticLikeState, setOptimisticState] =
    useOptimistic(likeDisplayState);

  const [reportDialogOpened, setReportDialogOpend] = useState<boolean>(false);

  async function handleLike() {
    startTransition(async () => {
      const newLikeState = toggleLike({
        isLiked: optimisticLikeState.isLiked,
        count: optimisticLikeState.count,
      });

      const newDisplayState: LikeDisplayState = {
        isLiked: newLikeState.isLiked,
        count: newLikeState.count,
      };
      setOptimisticState(newDisplayState);

      if ((await onLike(newLikeState.isLiked)) === false) {
        return;
      }

      setLikeDisplayState(newDisplayState);
    });
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
              optimisticLikeState.isLiked
                ? "text-pink-500"
                : "text-muted-foreground hover:text-pink-500"
            )}
          >
            <HeartIcon
              className={cn(
                "size-5 transition-all",
                optimisticLikeState.isLiked && "fill-current scale-110"
              )}
            />
            <span className="font-medium">{optimisticLikeState.count}</span>
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

      <ReportDialog
        isOpen={reportDialogOpened}
        onOpenChange={setReportDialogOpend}
        onSubmitReport={onReport}
      />
    </>
  );
}
