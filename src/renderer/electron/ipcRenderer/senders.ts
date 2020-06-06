import { ipcRenderer } from 'electron';

export async function startConvert(arg) {
  return ipcRenderer.invoke('start:convert', arg);
}
