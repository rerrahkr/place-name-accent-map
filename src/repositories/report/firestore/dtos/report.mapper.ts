// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { serverTimestamp } from "firebase/firestore";
import type { DeleteReason, Report } from "@/features/report";
import { type ReportRequest, reportRequestSchema } from "./report";

const deleteReasonMap: Record<DeleteReason, ReportRequest["deleteReason"]> = {
  duplicate: "duplicate",
  inappropriate: "inappropriate",
  incorrect: "incorrect",
  spam: "spam",
} as const;

export function reportToRequest(report: Report): ReportRequest {
  const request: ReportRequest = {
    placeId: report.placeId,
    uid: report.userId,
    deleteReason: deleteReasonMap[report.data.reason],
    createdAt: serverTimestamp(),
  };

  return reportRequestSchema.parse(request);
}
