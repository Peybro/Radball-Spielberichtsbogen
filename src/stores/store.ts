import { writable } from "svelte/store";

export const metaInfo = writable({
  title: "",
  location: "",
  date: "",
  startTime: "",
  endTime: "",
  chiefReferee: "",
  referee: "",
  duration: "2 x 7",
  notPlaying: "",
});
