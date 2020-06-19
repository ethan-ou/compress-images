import { ProcessActionTypes, START_PROCESS, STOP_PROCESS } from './types';
import { queueFiles, cancelFiles } from '../files/actions';
import { ThunkActionT, ThunkDispatchT } from '..';
import { cancelMainProcess, startMainProcess } from '../../electron/ipcRenderer/senders';

export function startProcessMode(): ProcessActionTypes {
  return { type: START_PROCESS };
}

export function stopProcessMode(): ProcessActionTypes {
  return { type: STOP_PROCESS };
}

export const startProcess = (): ThunkActionT => (dispatch: ThunkDispatchT, getState): void => {
  dispatch(queueFiles());
  dispatch(startProcessMode());
  startMainProcess(getState().files.files, getState().settings.settings);
};

export const cancelProcess = (): ThunkActionT => (dispatch: ThunkDispatchT): void => {
  cancelMainProcess();
  dispatch(cancelFiles());
  dispatch(stopProcessMode());
};

export const finishProcess = (): ThunkActionT => (dispatch: ThunkDispatchT): void => {
  dispatch(stopProcessMode());
};
