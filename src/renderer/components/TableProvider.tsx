import { useReducer } from 'react';
import { range } from '../utils';

const DESELECT_ALL = 'DESELECT_ALL';
const SELECT = 'SELECT';
const SELECT_CTRL = 'SELECT_CTRL';
const DESELECT_CTRL = 'DESELECT_CTRL';
const SELECT_SHIFT = 'SELECT_SHIFT';
const SELECT_SHIFT_CTRL = 'SELECT_SHIFT_CTRL';

export interface TableState {
  selected: {
    items: number[];
    pivot: number | null;
  };
}

const tableState: TableState = {
  selected: {
    items: [],
    pivot: null,
  },
};

interface DeselectAllAction {
  type: typeof DESELECT_ALL;
}

interface SelectAction {
  type: typeof SELECT;
  index: number;
}

interface SelectCtrlAction {
  type: typeof SELECT_CTRL;
  index: number;
}

interface DeselectCtrlAction {
  type: typeof DESELECT_CTRL;
  index: number;
}

interface SelectShiftAction {
  type: typeof SELECT_SHIFT;
  index: number;
}

interface SelectShiftCtrlAction {
  type: typeof SELECT_SHIFT_CTRL;
  index: number;
}

export type TableActionTypes =
  | DeselectAllAction
  | SelectAction
  | SelectCtrlAction
  | DeselectCtrlAction
  | SelectShiftAction
  | SelectShiftCtrlAction;

function tableReducer(state: TableState, action: TableActionTypes): TableState {
  switch (action.type) {
    case DESELECT_ALL: {
      return {
        ...state,
        selected: { ...state.selected, items: [], pivot: null },
      };
    }

    case SELECT: {
      return {
        ...state,
        selected: {
          ...state.selected,
          items: [action.index],
          pivot: action.index,
        },
      };
    }

    case SELECT_CTRL: {
      return {
        ...state,
        selected: {
          ...state.selected,
          items: [...state.selected.items, action.index],
          pivot: action.index,
        },
      };
    }

    case DESELECT_CTRL: {
      return {
        ...state,
        selected: {
          ...state.selected,
          items: state.selected.items.filter((index: number) => index !== action.index),
          pivot: action.index,
        },
      };
    }

    case SELECT_SHIFT: {
      if (state.selected.pivot === null || action.index === null) {
        return state;
      }

      const newRange = range(state.selected.pivot, action.index);
      return {
        ...state,
        selected: {
          ...state.selected,
          items: [...Array.from(new Set(newRange))],
        },
      };
    }

    case SELECT_SHIFT_CTRL: {
      if (state.selected.pivot === null || action.index === null) {
        return state;
      }

      const newRange = Array.from(range(state.selected.pivot, action.index));
      return {
        ...state,
        selected: {
          ...state.selected,
          items: [...Array.from(new Set([...state.selected.items, ...newRange]))],
        },
      };
    }

    default: {
      return state;
    }
  }
}

export type TableSelectProps = (event: any, index: number | null) => void;
export type TableStateProps = () => TableState;

export interface TableProps {
  handleTableSelect: TableSelectProps;
  getTableState: TableStateProps;
}

export default function TableProvider(): TableProps {
  const [state, dispatch] = useReducer(tableReducer, tableState);

  const handleSelect = (event, index: number | null) => {
    const { shiftKey, ctrlKey } = event;

    // Clicked outside of table
    if (index === null) {
      return dispatch({ type: DESELECT_ALL });
    }

    const pivotSelected = state.selected.pivot !== null;
    const itemAlreadySelected = state.selected.items.includes(index);

    if (pivotSelected && shiftKey && ctrlKey) {
      return dispatch({ type: SELECT_SHIFT_CTRL, index });
    }

    if (pivotSelected && shiftKey) {
      return dispatch({ type: SELECT_SHIFT, index });
    }

    if (itemAlreadySelected && ctrlKey) {
      return dispatch({ type: DESELECT_CTRL, index });
    }

    if (ctrlKey) {
      return dispatch({ type: SELECT_CTRL, index });
    }

    if (state.selected.items.length === 1 && itemAlreadySelected) {
      return dispatch({ type: DESELECT_ALL });
    }

    return dispatch({ type: SELECT, index });
  };

  const getState = () => {
    return state;
  };

  return {
    handleTableSelect: handleSelect,
    getTableState: getState,
  };
}
