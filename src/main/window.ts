import { BrowserWindow } from 'electron';

let win: BrowserWindow | null;

export function getWindow(): BrowserWindow | null {
  return win;
}

export function setWindow(w: BrowserWindow | null): void {
  win = w;
}
