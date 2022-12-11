import { atom } from 'jotai';
import {Timer} from "../types/types";

export const dashboardItems = atom<Map<string, string | number | boolean>>(new Map());
export const timerAtom = atom<Timer>({ nanos: 0, secs: 0 });
