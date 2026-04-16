// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import type { DELETE_REASONS } from "./consts";

export type DeleteReason = (typeof DELETE_REASONS)[number];

export type ReportData = {
  reason: DeleteReason;
};
