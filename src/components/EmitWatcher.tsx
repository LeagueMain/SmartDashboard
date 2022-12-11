import { useAtom } from "jotai";
import { appWindow } from "@tauri-apps/api/window";
import { useEffect } from "react";
import {dashboardItems, timerAtom} from "../atoms/atoms";
import { invoke } from "@tauri-apps/api/tauri";
import {Timer} from "../types/types";


const EmitWatcher: React.FC = () => {
  const [items, setItems] = useAtom(dashboardItems);
  const [_, setTime] = useAtom(timerAtom);

  type emitType = "number" | "boolean" | "string"

  useEffect(() => {
    async function func() {
      appWindow.listen<string>('put-number',
      ({payload}) => {
          console.log(payload);
          putItem(payload, "number");
        }
      )
      appWindow.listen<string>('put-boolean',
      ({payload}) => {
          putItem(payload, "boolean");
        }
      )
      appWindow.listen<string>('put-string',
      ({payload}) => {
            putItem(payload, "string");
        }
      )

      invoke("report_time_elapsed");
      appWindow.listen<Timer>('time_elapsed',
        ({payload}) => {
          setTime(payload);
        }
      )
    }
    func();
  }, [])

  function putItem(payload: string, type: emitType = "string") {
    const [key, value] = payload.split(':');

    if (key === undefined || key === "") throw new Error("key is undefined or empty");
    if (value === undefined) throw new Error('Invalid payload: value is undefined');
    switch (type) {
      case "number":
        if (isNaN(Number(value))) throw new Error('Invalid payload: value is not a number');
        if (items.has(key) && typeof items.get(key) !== "number")
          throw new Error('Invalid payload: key already exists and is not a number');
        break;
      case "boolean":
        if (value !== 'true' && value !== 'false') throw new Error('Invalid payload: value is not a boolean');
        if (items.has(key) && typeof items.get(key) !== "boolean")
          throw new Error('Invalid payload: key already exists and is not a boolean');
        break;
      case "string":
        if (items.has(key) && typeof items.get(key) !== "string")
            throw new Error('Invalid payload: key already exists and is not a string');
        break;
    }

    // don't update if key already exists
    if (items.get(key) === value) return;
    // update
    setItems((prev)=> {
      const temp = new Map(prev);
      temp.set(key, value);
      return temp;
    });
  }

  useEffect(() => {
    console.log(items);
  }, [items])

  return <></>
}

export default EmitWatcher;