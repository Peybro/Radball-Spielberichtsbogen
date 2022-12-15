import { writable } from "svelte/store";
import {
  initialMetaInfo,
  initialTeamList,
  initialMatchList,
} from "./initialValues";

export const metaInfo = writable(initialMetaInfo);
export const teamList = writable(initialTeamList);
export const matchList = writable(initialMatchList);

export const localSaves = writable(
  JSON.parse(localStorage.getItem("allData")) || []
);

localSaves.subscribe((value) =>
  localStorage.setItem("allData", JSON.stringify(value))
);
