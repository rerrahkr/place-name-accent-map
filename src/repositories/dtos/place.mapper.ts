// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import type { PlaceData } from "@/models/place";
import type { LikeDto } from "./like";
import type { PlaceDataDto } from "./place";

export function dtoToPlace(
  placeDto: PlaceDataDto,
  likeDtos: LikeDto[]
): PlaceData {}
