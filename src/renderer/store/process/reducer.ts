import { START_PROCESS, STOP_PROCESS, ProcessState, ProcessActionTypes } from './types';

const initialState: ProcessState = {
  mode: 'WAITING',
};

export function processReducer(state = initialState, action: ProcessActionTypes): ProcessState {
  switch (action.type) {
    case START_PROCESS: {
      return {
        ...state,
        mode: 'PROCESSING',
      };
    }

    case STOP_PROCESS: {
      return {
        ...state,
        mode: 'WAITING',
      };
    }

    default: {
      return state;
    }
  }
}
