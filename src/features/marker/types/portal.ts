// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

export type PopupPortalEntry = {
  /** The same value as the place data's ID.  */
  id: string;
  container: HTMLDivElement;
  content: React.ReactNode;
};

/** Interface of portal manager for popup contents. */
export type PopupPortalManager = {
  /**
   * Add a given portal entry to management targets.
   * @param portal Portal entry.
   */
  addPortal: (portal: PopupPortalEntry) => void;

  /**
   * Remove portal entry from management targets.
   * @param id ID of the portal entry to be deleted.
   */
  removePortal: (id: string) => void;
};
