// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import type { Report } from "@/features/report";

export type ReportRepository = {
  /**
   * Add a report to the repository.
   * @param report A new report.
   */
  addReport: (report: Report) => Promise<void>;
};
