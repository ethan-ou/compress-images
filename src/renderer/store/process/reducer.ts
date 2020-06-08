import {
  START_PROCESS,
  CANCEL_PROCESS,
  ProcessState,
  FINISH_PROCESS,
  ProcessActionTypes,
} from './types';

const initialState: ProcessState = {
  mode: 'INITIAL',
};

export function processReducer(state = initialState, action: ProcessActionTypes): ProcessState {
  switch (action.type) {
    case START_PROCESS: {
      return {
        ...state,
        mode: 'PROCESSING',
      };
    }

    case CANCEL_PROCESS: {
      return {
        ...state,
        mode: 'CANCELLED',
      };
    }

    case FINISH_PROCESS: {
      return {
        ...state,
        mode: 'FINISHED',
      };
    }

    default: {
      return state;
    }
  }
}
