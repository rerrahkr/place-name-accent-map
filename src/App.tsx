// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import { Toaster } from "sonner";
import { MapComponent } from "./components/map";

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <MapComponent className="h-dvh w-dvw" />
    </>
  );
}

export default App;
