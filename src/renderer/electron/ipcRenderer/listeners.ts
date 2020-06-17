import { ipcRenderer } from 'electron';
import { AppFile } from '../../../types';

export default function initIpcListeners(): void {
  ipcRenderer.on('process:fileSuccess', (_, file: AppFile) => {
    dispatchThunk();
  });

  ipcRenderer.on('process:fileError', (_, error: Error) => {
    dispatchThunk();
  });

  ipcRenderer.on('process:finish', (_) => {
    dispatchThunk();
  });
}
