// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

export class AuthServerError extends Error {
  innerError: unknown;

  constructor(innerError: unknown) {
    super("Authentication server error");
    this.innerError = innerError;
  }
}
