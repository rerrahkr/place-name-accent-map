// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { addDoc, collection, FirestoreError } from "firebase/firestore";
import { ZodError } from "zod";
import type { Report } from "@/features/report";
import { db } from "@/lib/firebase";
import { RequestSchemaError, ServerSystemError } from "@/repositories/errors";
import type { ReportRepository } from "../report-repository";
import type { ReportRequest } from "./dtos/report";
import { reportToRequest } from "./dtos/report.mapper";

async function sendReportRequest(request: ReportRequest): Promise<void> {
  try {
    console.log(request);
    await addDoc(collection(db, "reports"), request);
  } catch (error: unknown) {
    if (error instanceof FirestoreError) {
      throw new ServerSystemError(error);
    } else {
      throw error;
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

export const reportRepository: ReportRepository = {
  addReport,
};
