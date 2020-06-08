import { AppFile, FileStatus } from '../../../types';

export const ADD_FILES = 'ADD_FILES';
export const REMOVE_FILES = 'REMOVE_FILES';
export const SELECT_FILES = 'SELECT_FILES';
export const CLEAR_FILES = 'CLEAR_FILES';

// TODO: Remove files: any and confirm event type.

export type FileEvent = React.DragEvent | React.MouseEvent | React.KeyboardEvent;

export interface FilesState {
  files: AppFile[];
  selected: {
    items: number[];
    pivot: number | null;
  };
}

interface AddFilesAction {
  type: typeof ADD_FILES;
  files: AppFile[];
  status: FileStatus;
}

interface RemoveFilesAction {
  type: typeof REMOVE_FILES;
}

interface SelectFilesAction {
  type: typeof SELECT_FILES;
  event: FileEvent;
  index: number | null;
}

interface ClearFilesAction {
  type: typeof CLEAR_FILES;
}

export type FilesActionTypes =
  | AddFilesAction
  | RemoveFilesAction
  | SelectFilesAction
  | ClearFilesAction;
