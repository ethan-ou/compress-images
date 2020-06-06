import {
  ADD_FILES,
  REMOVE_FILES,
  SELECT_FILES,
  CLEAR_FILES,
  FilesActionTypes,
  AppFile,
  FileStatus,
  FileEvent,
} from './types';

// TODO: Remove files: any and event: any

export function addFiles(files: AppFile[], status: FileStatus): FilesActionTypes {
  return { type: ADD_FILES, files, status };
}

export function removeFiles(): FilesActionTypes {
  return { type: REMOVE_FILES };
}

export function selectFiles(event: FileEvent, index: number | null): FilesActionTypes {
  return { type: SELECT_FILES, event, index };
}

export function clearFiles(): FilesActionTypes {
  return { type: CLEAR_FILES };
}
