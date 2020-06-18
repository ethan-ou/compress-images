import { ipcMain, IpcMainEvent } from 'electron';
import process from '../process';
import { AppFile } from '../../types';

export default function initIpcListeners(): void {
  ipcMain.on('process:start', (event: IpcMainEvent, files: AppFile[], options: any): void => {
    process
      .create(
        files,
        options,
        (file) => event.reply('process:fileProcessing', file),
        (file) => event.reply('process:fileSuccess', file),
        (file, error) => event.reply('process:fileError', file, error)
      )
      .then(() => {
        event.reply('process:finish');
      });
  });

  ipcMain.on('process:cancel', () => {
    process.cancel();
  });
}
