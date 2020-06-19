import { ipcRenderer } from 'electron';
import { AppFile } from '../../../types';
import store, { ThunkDispatchT } from '../../store';
import { finishProcess } from '../../store/process/actions';
import { fileError, fileSuccess, fileProcessing } from '../../store/files/actions';

const dispatchThunk = store.dispatch as ThunkDispatchT;

export default function initIpcListeners(): void {
  ipcRenderer.on('process:fileProcessing', (_, file: AppFile) => {
    dispatchThunk(fileProcessing(file));
  });

  ipcRenderer.on('process:fileSuccess', (_, file: AppFile) => {
    dispatchThunk(fileSuccess(file));
  });

  ipcRenderer.on('process:fileError', (_, file: AppFile, error) => {
    dispatchThunk(fileError(file, error));
  });

  ipcRenderer.on('process:finish', (_) => {
    dispatchThunk(finishProcess());
  });

  // Add process:confirm to confirm whether a file should be overwritten.
  // Add a pre-convert check to see whether the files should be overwritten.
}
