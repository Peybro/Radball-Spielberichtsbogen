import { writable } from "svelte/store";
import {
  initialMatchList,
  initialMetaInfo,
  initialTeamList,
} from "./initialValues";
import Match from "./../model/Match";
import Team from "./../model/Team";

export const metaInfo = writable(initialMetaInfo);
export const teamList = writable<Team[]>(initialTeamList);
export const matchList = writable<Match[]>(initialMatchList);

export const matchToImport = writable("");
export const bigTableLiga = writable("");

export const shortLink = writable("");

export const localSaves = writable(
  JSON.parse(localStorage.getItem("allData")) || []
);

localSaves.subscribe((value) =>
  localStorage.setItem("allData", JSON.stringify(value))
);
