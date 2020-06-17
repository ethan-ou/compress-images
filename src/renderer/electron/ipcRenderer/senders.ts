import { ipcRenderer } from 'electron';
import { AppFile } from '../../../types';

export async function startProcess(files: AppFile[], options: any): Promise<void> {
  return ipcRenderer.send('process:start', files, options);
}

export async function pauseProcess(): Promise<void> {
  return ipcRenderer.send('process:pause');
}

export async function endProcess(): Promise<void> {
  return ipcRenderer.send('process:end');
}
