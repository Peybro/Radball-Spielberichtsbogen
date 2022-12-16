import { writable } from "svelte/store";

export const menuMode = writable(false);
export const menuRight = writable(true);
export const resetMode = writable(false);
export const importMode = writable(false);
export const exportMode = writable(false);
export const teamEditMode = writable(true);
