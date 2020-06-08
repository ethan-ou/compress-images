import { ipcRenderer } from 'electron';
import { AppFile } from '../../../types';

export async function startProcess(files: AppFile[]): Promise<void> {
  return ipcRenderer.send('process:start', files);
}
