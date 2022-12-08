import type { InvokeArgs } from "@tauri-apps/api/tauri"
import dynamic from "next/dynamic";
import React from "react";


const isNode = (): boolean =>
  Object.prototype.toString.call(typeof process !== "undefined" ? process : 0) ===
  "[object process]"

export async function getWatcher(): Promise<unknown | React.Component> {
  if (isNode()) {
    // This shouldn't ever happen when React fully loads
    return Promise.resolve(undefined as unknown)
  }
  const EmitWatcher = await dynamic(() => import("../components/EmitWatcher"), {
    ssr: false,
  })
  return EmitWatcher;
}