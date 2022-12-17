import { writable } from "svelte/store";
import {
  initialMatchList,
  initialMetaInfo,
  initialTeamList,
} from "./initialValues";

export const metaInfo = writable(initialMetaInfo);
export const teamList = writable(initialTeamList);
export const matchList = writable(initialMatchList);

export const matchToImport = writable("");
export const bigTableLiga = writable("");

export const localSaves = writable(
  JSON.parse(localStorage.getItem("allData")) || []
);

localSaves.subscribe((value) =>
  localStorage.setItem("allData", JSON.stringify(value))
);
