// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import type { ZodError } from "zod";

/**
 * Error caused by server system.
 */
export class ServerSystemError extends Error {
  readonly innerError: unknown;

  constructor(innerError: unknown) {
    super("Server system error");
    this.innerError = innerError;
  }
}

export class ServerRuleError extends Error {
  readonly innerError: unknown;

  constructor(innerError: unknown) {
    super("Server rule error");
    this.innerError = innerError;
  }
}

/**
 * Error caused by response schema validation.
 */
export class ResponseSchemaError extends Error {
  readonly innerError: ZodError;

  constructor(error: ZodError) {
    const messages = error.issues.map((i) => i.message);
    super(`Illegal schema:\n${messages.join("\n")}`);
    this.innerError = error;
  }
}

/**
 * Error caused by request schema validation.
 */
export class RequestSchemaError extends Error {
  readonly innerError: ZodError;

  constructor(error: ZodError) {
    const messages = error.issues.map((i) => i.message);
    super(`Illegal schema:\n${messages.join("\n")}`);
    this.innerError = error;
  }
}
