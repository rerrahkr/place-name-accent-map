// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { describe, expect, it } from "vitest";
import type { DeleteReason } from "@/features/report";
import { createNewPlaceId } from "@/models/place";
import { createUserId } from "@/models/user";
import type { ReportRequest } from "./report";
import { reportToRequest } from "./report.mapper";

describe("reportToRequest", () => {
  it("should work correctly", () => {
    const userId = createUserId("hoge");
    const placeId = createNewPlaceId();
    const deleteReasons: DeleteReason[] = [
      "duplicate",
      "inappropriate",
      "incorrect",
      "spam",
    ];

    for (const reason of deleteReasons) {
      expect(
        reportToRequest({
          userId,
          placeId,
          data: {
            reason,
          },
        })
      ).toEqual({
        userId,
        placeId,
        deleteReason: reason,
      } satisfies ReportRequest);
    }
  });
});
