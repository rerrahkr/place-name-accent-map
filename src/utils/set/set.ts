// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

export function difference<T>(
  a: ReadonlySet<T>,
  b: ReadonlySet<T>
): ReadonlySet<T> {
  return new Set([...a].filter((v) => !b.has(v)));
}
