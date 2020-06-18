import shortid from 'shortid';
import {
  FilesState,
  FilesActionTypes,
  ADD_FILES,
  REMOVE_FILES,
  CLEAR_FILES,
  QUEUE_FILES,
  FILE_SUCCESS,
  FILE_ERROR,
  FILE_PROCESSING,
} from './types';
import { AppFile } from '../../../types';

const initialState: FilesState = {
  files: [],
};

export function filesReducer(state = initialState, action: FilesActionTypes): FilesState {
  switch (action.type) {
    case ADD_FILES: {
      const files = action.files.map(
        (file): AppFile => {
          return {
            ...file,
            id: shortid.generate(),
            status: 'Waiting',
          };
        }
      );
      return {
        ...state,
        files: [...state.files, ...files],
      };
    }

    case REMOVE_FILES: {
      const files = state.files.filter((_, index) => {
        return !action.location.includes(index);
      });
      return { ...state, files };
    }

    case CLEAR_FILES: {
      return { ...state, files: [] };
    }

    case QUEUE_FILES: {
      const files = state.files.map(
        (file): AppFile => {
          return { ...file, status: 'Queued' };
        }
      );

      return { ...state, files };
    }

    case FILE_SUCCESS: {
      const files = state.files.map(
        (file): AppFile => {
          if (file.id === action.file.id) {
            return { ...file, status: 'Completed' };
          }
          return file;
        }
      );

      return { ...state, files };
    }

    case FILE_ERROR: {
      const files = state.files.map(
        (file): AppFile => {
          if (file.id === action.file.id) {
            return { ...file, status: 'Failed' };
          }
          return file;
        }
      );

      return { ...state, files };
    }

    case FILE_PROCESSING: {
      const files = state.files.map(
        (file): AppFile => {
          if (file.id === action.file.id) {
            return { ...file, status: 'Processing' };
          }
          return file;
        }
      );

      return { ...state, files };
    }

    default: {
      return state;
    }
  }
}
