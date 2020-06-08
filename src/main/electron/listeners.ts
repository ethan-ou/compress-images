import { ipcMain, IpcMainEvent } from 'electron';

export default function initIpcListeners(): void {
  ipcMain.on('process:start', (event: IpcMainEvent): void => {
    console.log(event);
  });
}
