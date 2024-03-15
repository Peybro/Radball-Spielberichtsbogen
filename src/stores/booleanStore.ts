import { writable } from "svelte/store";

export const menuMode = writable(false);
export const menuRight = writable(true);
export const resetMode = writable(false);
export const teamEditMode = writable(true);

export const mainMode = writable(true);
export const importMode = writable(false);
export const exportMode = writable(false);
export const bigTableMode = writable(false);

export const showClipboardSuccess = writable(false);

mainMode.subscribe((val) => {
  if (val) {
    importMode.set(false);
    exportMode.set(false);
    bigTableMode.set(false);
  }
});

importMode.subscribe((val) => {
  if (val) {
    mainMode.set(false);
    exportMode.set(false);
    bigTableMode.set(false);
  }
});

exportMode.subscribe((val) => {
  if (val) {
    mainMode.set(false);
    importMode.set(false);
    bigTableMode.set(false);
  }
});

bigTableMode.subscribe((val) => {
  if (val) {
    mainMode.set(false);
    importMode.set(false);
    exportMode.set(false);
  }
});
