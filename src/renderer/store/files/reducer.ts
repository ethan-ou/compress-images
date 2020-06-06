import shortid from 'shortid';
import {
  FilesState,
  FilesActionTypes,
  ADD_FILES,
  REMOVE_FILES,
  SELECT_FILES,
  CLEAR_FILES,
} from './types';
import { range } from './utils';

const initialState: FilesState = {
  files: [],
  selected: {
    items: [],
    pivot: null,
  },
};

export function filesReducer(state = initialState, action: FilesActionTypes): FilesState {
  switch (action.type) {
    case ADD_FILES: {
      const files = action.files.map((file) => {
        return {
          ...file,
          id: shortid.generate(),
          status: action.status,
        };
      });
      return {
        ...state,
        files: [...state.files, ...files],
      };
    }

    case REMOVE_FILES: {
      const files = state.files.filter((_, index) => {
        return !state.selected.items.includes(index);
      });
      return { ...state, files, selected: { items: [], pivot: null } };
    }

    case SELECT_FILES: {
      if (action.index === null) {
        return {
          ...state,
          selected: { ...state.selected, items: [], pivot: null },
        };
      }

      //Case 1: Already selected one element, SHIFT + CTRL
      if (state.selected.pivot !== null && action.event.shiftKey && action.event.ctrlKey) {
        const newRange = Array.from(range(state.selected.pivot, action.index));
        return {
          ...state,
          selected: {
            ...state.selected,
            items: [...new Set([...state.selected.items, ...newRange])],
          },
        };
      }

      //Case 2: Already selected one element, SHIFT
      if (state.selected.pivot !== null && action.event.shiftKey) {
        const newRange = range(state.selected.pivot, action.index);
        return {
          ...state,
          selected: {
            ...state.selected,
            items: [...new Set(newRange)],
          },
        };
      }

      // Case 3: Selected and deselecting, CTRL
      if (state.selected.items.includes(action.index) && action.event.ctrlKey) {
        return {
          ...state,
          selected: {
            ...state.selected,
            items: state.selected.items.filter((index) => index !== action.index),
            pivot: action.index,
          },
        };
      }

      //Case 4: CTRL selection
      if (action.event.ctrlKey) {
        return {
          ...state,
          selected: {
            ...state.selected,
            items: [...state.selected.items, action.index],
            pivot: action.index,
          },
        };
      }

      //Case 5: Selected, and deselecting, no keyboard
      if (state.selected.items.length === 1 && state.selected.items[0] === action.index) {
        return {
          ...state,
          selected: { ...state.selected, items: [], pivot: null },
        };
      }

      //Case 6: No selection, no keyboard
      return {
        ...state,
        selected: {
          ...state.selected,
          items: [action.index],
          pivot: action.index,
        },
      };
    }

    case CLEAR_FILES: {
      return { ...state, files: [], selected: { items: [], pivot: null } };
    }

    default: {
      return state;
    }
  }
}
