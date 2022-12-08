import { atom, Getter } from 'jotai';

export const dashNumbers = atom<Map<string, number>>(new Map());
export const dashBooleans = atom<Map<string, boolean>>(new Map());
export const dashStrings = atom<Map<string, string>>(new Map());

export const dashItems = atom((get: Getter) => {
  // concat all the maps into one
  const numbers = get(dashNumbers);
  const booleans = get(dashBooleans);
  const strings = get(dashStrings);
  return concatenateMaps<string | number | boolean>([numbers, booleans, strings]);
});

function concatenateMaps<T>(maps: Map<string, T>[]): Map<string, T> {
  return new Map(maps.flatMap((map) => [...map]));
}