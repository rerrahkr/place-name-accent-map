// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { Toaster } from "sonner";
import { useAnonymousSignIn, useAuth } from "./features/auth";
import { MapComponent } from "./features/map";
import { firebaseAuthGateway } from "./gateways/auth";
import { inMemoryPlaceRepository } from "./repositories/place";
import { inMemoryReportRepository } from "./repositories/report";

function App() {
  useAuth(firebaseAuthGateway);
  useAnonymousSignIn(firebaseAuthGateway);

  return (
    <>
      <Toaster position="top-center" />
      <MapComponent
        className="h-dvh w-dvw"
        placeRepository={inMemoryPlaceRepository}
        reportRepository={inMemoryReportRepository}
      />
    </>
  );
}

export default App;
