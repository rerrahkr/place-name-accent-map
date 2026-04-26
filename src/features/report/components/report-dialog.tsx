// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import type React from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { DeleteReason, ReportData } from "../models/report-data";
import { DELETE_REASONS, explainDeleteReason } from "../models/report-data";

type ReportDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitReport: (reportData: ReportData) => void;
};

export function ReportDialog({
  isOpen,
  onOpenChange,
  onSubmitReport,
}: ReportDialogProps): React.JSX.Element {
  const [deleteReason, setSelectedReason] = useState<DeleteReason | undefined>(
    undefined
  );

  function handleSubmit() {
    if (deleteReason === undefined) {
      return;
    }

    onSubmitReport({ reason: deleteReason });

    onOpenChange(false);
    setSelectedReason(undefined);
  }

  function handleCancel() {
    onOpenChange(false);
    setSelectedReason(undefined);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="z-[2000]">
        <DialogHeader>
          <DialogTitle>削除を依頼</DialogTitle>
          <DialogDescription>
            削除を依頼する理由を選択してください
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {DELETE_REASONS.map((reason) => (
            <label
              key={reason}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="radio"
                name="reason"
                value={reason}
                checked={deleteReason === reason}
                onChange={() => setSelectedReason(reason)}
                className="w-4 h-4"
              />
              <span className="text-sm">{explainDeleteReason(reason)}</span>
            </label>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            キャンセル
          </Button>
          <Button onClick={handleSubmit} disabled={!deleteReason}>
            送信
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
