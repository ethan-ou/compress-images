export const START_PROCESS = 'START_PROCESS';
export const CANCEL_PROCESS = 'CANCEL_PROCESS';
export const FINISH_PROCESS = 'FINISH_PROCESS';

interface StartProcessAction {
  type: typeof START_PROCESS;
}

interface CancelProcessAction {
  type: typeof CANCEL_PROCESS;
}

interface FinishProcessAction {
  type: typeof FINISH_PROCESS;
}

export type ProcessActionTypes = StartProcessAction | CancelProcessAction | FinishProcessAction;

export type ProcessMode = 'INITIAL' | 'PROCESSING' | 'CANCELLED' | 'FINISHED';

export interface ProcessState {
  mode: ProcessMode;
}
