// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { Toaster } from "sonner";
import { MapComponent } from "./features/map";
import { inMemoryPlaceRepository } from "./repositories/in-memory-place-repository";

function App() {
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
