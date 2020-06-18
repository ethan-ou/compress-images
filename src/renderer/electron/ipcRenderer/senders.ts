import { ipcRenderer } from 'electron';
import { AppFile } from '../../../types';

export async function startMainProcess(files: AppFile[], options: any): Promise<void> {
  return ipcRenderer.send('process:start', files, options);
}

export async function pauseMainProcess(): Promise<void> {
  return ipcRenderer.send('process:pause');
}

export async function cancelMainProcess(): Promise<void> {
  return ipcRenderer.send('process:cancel');
}
