import { useAtom } from "jotai";
import { appWindow } from "@tauri-apps/api/window";
import { useEffect } from "react";
import { dashNumbers, dashBooleans, dashStrings, dashItems } from "../atoms/atoms";


const EmitWatcher: React.FC = () => {
  const [nums, setNums] = useAtom(dashNumbers);
  const [bools, setBools] = useAtom(dashBooleans);
  const [strings, setStrings] = useAtom(dashStrings);
  const [items, _] = useAtom(dashItems);

  useEffect(() => {
    async function func() {
      await appWindow.listen<string>('put-number', 
        ({payload}) => handlePutNumber(payload)
      )
      await appWindow.listen<string>('put-boolean',
        ({payload}) => handlePutBoolean(payload)
      )
      await appWindow.listen<string>('put-string',
        ({payload}) => handlePutString(payload)
      )
    }
    func();
  }, [])

  function handlePutNumber(payload: string) {
    const [key, value] = payload.split(":");

    // ensure value is valid
    if (value === undefined) throw Error('value is undefined');
    if (Number.isNaN(parseFloat(value))) throw Error('value isn\'t a number');

    // check if key exists in other maps
    if (bools.has(String(key))) {
      // delete from bools
      setBools((prev) => {
        const temp = new Map([...prev]);
        temp.delete(String(key));
        return temp;
      });
    } else if (strings.has(String(key))) {
      // delete from strings
      setStrings((prev) => {
        const temp = new Map([...prev]);
        temp.delete(String(key));
        return temp;
      });
    }
    // add to nums
    setNums((prev) => {
      const temp = new Map([...prev])
      temp.set(String(key), parseFloat(value));
      return temp;
    });
  }

  function handlePutBoolean(payload: string) {
    const [key, value] = payload.split(":");
    // ensure value is valid
    if (value === undefined) throw Error('value is undefined');
    if (value !== 'true' && value !== 'false') throw Error('value isn\'t a boolean');

    // check if key exists in other maps
    if (nums.has(String(key))) {
      // delete from nums
      setNums((prev) => {
        const temp = new Map([...prev]);
        temp.delete(String(key));
        return temp;
      });
    } else if (strings.has(String(key))) {
      // delete from strings
      setStrings((prev) => {
        const temp = new Map([...prev]);
        temp.delete(String(key));
        return temp;
      });
    }

    // add to bools map
    setBools((prev) => {
      const temp = new Map([...prev]);
      temp.set(String(key), value === 'true');
      return temp;
    });
  }

  function handlePutString(payload: string) {
    const [key, value] = payload.split(":");
    
    // ensure value is valid
    if (value === undefined) throw Error('value is undefined');
    
    // check if key exists in other maps
    if (nums.has(String(key))) {
      // delete from nums
      setNums((prev) => {
        const temp = new Map([...prev]);
        temp.delete(String(key));
        return temp;
      });
    } else if (bools.has(String(key))) {
      // delete from bools
      setBools((prev) => {
        const temp = new Map([...prev]);
        temp.delete(String(key));
        return temp;
      });
    }

    // add to strings map
    setStrings((prev) => {
      const temp = new Map([...prev]);
      temp.set(String(key), value);
      return temp;
    });
  }

  useEffect(() => {
    console.log(items);
  }, [items])

  return <></>
}

export default EmitWatcher;