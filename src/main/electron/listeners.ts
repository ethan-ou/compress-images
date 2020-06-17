import { ipcMain, IpcMainEvent } from 'electron';
import process from '../process';
import { AppFile } from '../../types';

export default function initIpcListeners(): void {
  ipcMain.on('process:start', (event: IpcMainEvent, files: AppFile[], options: any): void => {
    process.create(
      files,
      options,
      (item) => event.reply('process:fileSuccess', item),
      (error) => event.reply('process:fileError', error)
    );
  });

  ipcMain.on('process:pause', () => {
    process.pause();
  });

  ipcMain.on('process:end', () => {
    process.end();
  });
}
