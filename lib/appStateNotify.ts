import { APP_STATE_CHANGED_EVENT } from "@/lib/appStateEvents";
import { isPersistSuppressed } from "@/lib/appStateFlags";

export function dispatchAppStateChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(APP_STATE_CHANGED_EVENT));
}

export function notifyAppStateLocalChanged(immediate = false): void {
  if (typeof window === "undefined") return;
  if (isPersistSuppressed()) return;

  dispatchAppStateChanged();

  void import("@/lib/appStatePersist").then((module) => {
    if (immediate) {
      void module.persistAppStateIfAuthed(true);
      return;
    }
    module.schedulePersistAppState();
  });
}
