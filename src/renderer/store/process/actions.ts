import { ProcessActionTypes, START_PROCESS, CANCEL_PROCESS, FINISH_PROCESS } from './types';

export function startProcess(): ProcessActionTypes {
  return { type: START_PROCESS };
}

export function cancelProcess(): ProcessActionTypes {
  return { type: CANCEL_PROCESS };
}

export function finishProcess(): ProcessActionTypes {
  return { type: FINISH_PROCESS };
}
