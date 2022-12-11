import {useAtom} from "jotai";
import {timerAtom} from "../atoms/atoms";

const BottomBar: React.FC = () => {
  const [time, _] = useAtom(timerAtom);

  // get first two digits of time.nanos
  const nanos = time.nanos.toString().slice(0, 2);

  return (
    <div className="absolute bottom-0 bg-[#191925] w-full text-white p-1 flex justify-between">
      <p>
        Elapsed Time: {time.secs}.{nanos}s
      </p>
      <p>
        e
      </p>
    </div>
  )
}

export default BottomBar;