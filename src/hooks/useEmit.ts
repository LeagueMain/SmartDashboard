import { appWindow,  } from "@tauri-apps/api/window";
import { useEffect } from "react";

enum TauriEvent {
  WINDOW_RESIZED = "tauri://resize",
  WINDOW_MOVED = "tauri://move",
  WINDOW_CLOSE_REQUESTED = "tauri://close-requested",
  WINDOW_CREATED = "tauri://window-created",
  WINDOW_DESTROYED = "tauri://destroyed",
  WINDOW_FOCUS = "tauri://focus",
  WINDOW_BLUR = "tauri://blur",
  WINDOW_SCALE_FACTOR_CHANGED = "tauri://scale-change",
  WINDOW_THEME_CHANGED = "tauri://theme-changed",
  WINDOW_FILE_DROP = "tauri://file-drop",
  WINDOW_FILE_DROP_HOVER = "tauri://file-drop-hover",
  WINDOW_FILE_DROP_CANCELLED = "tauri://file-drop-cancelled",
  MENU = "tauri://menu",
  CHECK_UPDATE = "tauri://update",
  UPDATE_AVAILABLE = "tauri://update-available",
  INSTALL_UPDATE = "tauri://update-install",
  STATUS_UPDATE = "tauri://update-status",
  DOWNLOAD_PROGRESS = "tauri://update-download-progress"
}

type EventName = TauriEvent | string;

interface Event<T> {
  /** Event name */
  event: EventName;
  /** The label of the window that emitted this event. */
  windowLabel: string;
  /** Event identifier used to unlisten */
  id: number;
  /** Event payload */
  payload: T;
}

type EventCallback<T> = (event: Event<T>) => void;

export function useEmit<T>(event: string, handler: EventCallback<T>) {
  useEffect(() => {
    async function func() {
      await appWindow.listen<T>(event, handler)
    }

    func();
  }, [])
}

export const usePutNumber = (handler: EventCallback<any>) => {
  useEmit<string>('put-number', handler);
}

export const usePutBoolean = (handler: EventCallback<string>) => {
  useEmit<string>('put-boolean', handler);
}

export const usePutString = (handler: EventCallback<string>) => {
  useEmit<string>('put-string', handler);
}

usePutString(({payload}) => {});

export function split<T>(str: string) {
  const list = str.split(':');
  return { key: list[0] as String, value: list[1] as T };
}