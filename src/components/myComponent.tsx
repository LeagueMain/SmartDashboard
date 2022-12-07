import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";
import { useEffect, useState } from "react";

const myComponent: React.FC = () => {
  const [text, setText] = useState('Hello worfld!');

  useEffect(() => {
    async function owo() {
      const isBrowser = typeof window !== 'undefined';
      if (!isBrowser) return;
      const test = await appWindow.listen(
        'from-rocket',
        ({event, payload}) => setText(payload)
      )
    }
    owo();
  }, []);
  return (
    <div>
      <button onClick={() => invoke('on_button_click')}>{text}</button>
    </div>
  )
}

export default myComponent;