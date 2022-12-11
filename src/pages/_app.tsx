import { type AppType } from "next/dist/shared/lib/utils";

import "../styles/globals.css";
import dynamic from "next/dynamic";
import BottomBar from "../components/BottomBar";
const EmitWatcher = dynamic(() => import("../components/EmitWatcher"), {
  ssr: false,
})

const MyApp: AppType = ({ Component, pageProps }) => {
  return <>
    <EmitWatcher />
    <Component {...pageProps} />
    <BottomBar />
  </>;
};

export default MyApp;
