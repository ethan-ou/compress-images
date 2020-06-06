export const START_CONVERT = 'START_CONVERT';
export const CANCEL_CONVERT = 'CANCEL_CONVERT';
export const FINISH_CONVERT = 'FINISH_CONVERT';

interface StartConvertAction {
  type: typeof START_CONVERT;
}

interface CancelConvertAction {
  type: typeof CANCEL_CONVERT;
}

interface FinishConvertAction {
  type: typeof FINISH_CONVERT;
}

export type ConvertActionTypes = StartConvertAction | CancelConvertAction | FinishConvertAction;

export type ConvertMode = 'INITIAL' | 'PROCESSING' | 'CANCELLED' | 'FINISHED';

export interface ConvertState {
  mode: ConvertMode;
}
