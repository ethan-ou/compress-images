import { AppFile } from '../../../types';

export const ADD_FILES = 'ADD_FILES';
export const REMOVE_FILES = 'REMOVE_FILES';
export const CLEAR_FILES = 'CLEAR_FILES';
export const QUEUE_FILES = 'QUEUE_FILES';
export const FILE_SUCCESS = 'FILE_SUCCESS';
export const FILE_ERROR = 'FILE_ERROR';
export const FILE_PROCESSING = 'FILE_PROCESSING';

export type FileEvent =
  | React.DragEvent
  | React.MouseEvent
  | React.KeyboardEvent
  | React.SyntheticEvent;

export interface FilesState {
  files: AppFile[];
}

interface AddFilesAction {
  type: typeof ADD_FILES;
  files: AppFile[];
}

interface RemoveFilesAction {
  type: typeof REMOVE_FILES;
  location: number[];
}

interface ClearFilesAction {
  type: typeof CLEAR_FILES;
}

interface QueueFilesAction {
  type: typeof QUEUE_FILES;
}

interface FileSuccessAction {
  type: typeof FILE_SUCCESS;
  file: AppFile;
}

interface FileErrorAction {
  type: typeof FILE_ERROR;
  file: AppFile;
  error: Error;
}

interface FileProcessingAction {
  type: typeof FILE_PROCESSING;
  file: AppFile;
}

export type FilesActionTypes =
  | AddFilesAction
  | RemoveFilesAction
  | ClearFilesAction
  | QueueFilesAction
  | FileSuccessAction
  | FileErrorAction
  | FileProcessingAction;
