// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import type { DeleteReason } from "../types";

const DELETE_REASON_TEXT: Readonly<Record<DeleteReason, string>> = {
  inappropriate: "不適切な内容",
  spam: "スパム",
  duplicate: "重複",
  incorrect: "誤った情報",
};

export function explainDeleteReason(reason: DeleteReason): string {
  return DELETE_REASON_TEXT[reason];
}
