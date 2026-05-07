// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

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
    userId: report.userId,
    deleteReason: deleteReasonMap[report.data.reason],
  };

  return reportRequestSchema.parse(request);
}
