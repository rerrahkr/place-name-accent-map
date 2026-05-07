// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { Toaster } from "sonner";
import { authGateway } from "@/gateways/auth";
import { useAnonymousSignIn, useAuth } from "./features/auth";
import { MapComponent } from "./features/map";
import { placeRepository } from "./repositories/place";
import { reportRepository } from "./repositories/report";

function App() {
  useAuth(authGateway);
  useAnonymousSignIn(authGateway);

  return (
    <>
      <Toaster position="top-center" />
      <MapComponent
        className="h-dvh w-dvw"
        placeRepository={placeRepository}
        reportRepository={reportRepository}
      />
    </>
  );
}

export default App;
