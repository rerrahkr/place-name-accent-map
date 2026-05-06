// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { ZodError } from "zod";
import type { Report } from "@/features/report";
import {
  RequestSchemaError,
  ServerRuleError,
  ServerSystemError,
} from "../errors";
import type { ReportRequest } from "./dtos/report";
import { reportToRequest } from "./dtos/report.mapper";
import type { ReportRepository } from "./report-repository";

type ReportDocument = ReportRequest;

// TODO: Actual document has createdAt field.
const reportDocuments: ReportDocument[] = [];

async function sendReportRequest(request: ReportRequest): Promise<void> {
  try {
    reportDocuments.push(request);
  } catch (error: unknown) {
    if (error instanceof ServerRuleError) {
      throw error;
    } else {
      throw new ServerSystemError(error);
    }
  }
}

async function addReport(report: Report): Promise<void> {
  const request = (() => {
    try {
      return reportToRequest(report);
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        throw new RequestSchemaError(error);
      } else {
        throw error;
      }
    }
  })();

  await sendReportRequest(request);
}

export const inMemoryReportRepository: ReportRepository = {
  addReport,
};
