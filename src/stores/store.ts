import { writable } from "svelte/store";
import {
  initialMetaInfo,
  initialTeamList,
  initialMatchList,
} from "./initialValues";

export const metaInfo = writable(initialMetaInfo);
export const teamList = writable(initialTeamList);
export const matchList = writable(initialMatchList);
