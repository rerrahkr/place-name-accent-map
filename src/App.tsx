// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { Toaster } from "sonner";
import { useAnonymousSignIn, useAuth } from "./features/auth";
import { MapComponent } from "./features/map";
import { firebaseAuthGateway } from "./gateways/auth";
import { inMemoryPlaceRepository } from "./repositories/place";

function App() {
  useAuth(firebaseAuthGateway);
  useAnonymousSignIn(firebaseAuthGateway);

  return (
    <>
      <Toaster position="top-center" />
      <MapComponent
        className="h-dvh w-dvw"
        repository={inMemoryPlaceRepository}
      />
    </>
  );
}

export default App;
