// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

export const DELETE_REASONS = [
  "inappropriate",
  "spam",
  "duplicate",
  "incorrect",
] as const;
export type DeleteReason = (typeof DELETE_REASONS)[number];

const DELETE_REASON_TEXT: Readonly<Record<DeleteReason, string>> = {
  inappropriate: "不適切な内容",
  spam: "スパム",
  duplicate: "重複",
  incorrect: "誤った情報",
};

export function explainDeleteReason(reason: DeleteReason): string {
  return DELETE_REASON_TEXT[reason];
}

export type ReportData = {
  reason: DeleteReason;
};
