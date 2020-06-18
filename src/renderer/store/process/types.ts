export const START_PROCESS = 'START_PROCESS';
export const STOP_PROCESS = 'STOP_PROCESS';

interface StartProcessAction {
  type: typeof START_PROCESS;
}

interface StopProcessAction {
  type: typeof STOP_PROCESS;
}

export type ProcessActionTypes = StartProcessAction | StopProcessAction;

export type ProcessMode = 'WAITING' | 'PROCESSING';

export interface ProcessState {
  mode: ProcessMode;
}
