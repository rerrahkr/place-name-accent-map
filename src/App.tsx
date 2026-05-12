// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { Toaster } from "sonner";
import { authGateway } from "@/gateways/auth";
import { useAnonymousSignIn, useAuth } from "./features/auth";
import { MapComponent } from "./features/map";
import { WelcomeDialog } from "./features/welcome";
import { placeRepository } from "./repositories/place";
import { reportRepository } from "./repositories/report";
import { useWelcomeStore } from "./stores/welcome";

function App() {
  useAuth(authGateway);

  const { isFirstAccess, changeOpenWelcomeDialogState, setFirstAccess } =
    useWelcomeStore();
  useAnonymousSignIn(authGateway, () => {
    if (isFirstAccess) {
      changeOpenWelcomeDialogState(true);
      setFirstAccess(false);
    }
  });

  return (
    <>
      <Toaster position="top-center" />
      <WelcomeDialog />
      <MapComponent
        className="h-dvh w-dvw"
        placeRepository={placeRepository}
        reportRepository={reportRepository}
      />
    </>
  );
}

export default App;
