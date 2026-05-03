// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { v7 as uuidv7 } from "uuid";

export function newId(): string {
  return uuidv7();
}
