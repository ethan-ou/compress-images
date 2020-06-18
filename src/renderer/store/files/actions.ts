import {
  ADD_FILES,
  REMOVE_FILES,
  CLEAR_FILES,
  QUEUE_FILES,
  FilesActionTypes,
  FILE_SUCCESS,
  FILE_ERROR,
  FILE_PROCESSING,
} from './types';
import { AppFile } from '../../../types';

export function addFiles(files: AppFile[]): FilesActionTypes {
  return { type: ADD_FILES, files };
}

export function removeFiles(location: number[]): FilesActionTypes {
  return { type: REMOVE_FILES, location };
}

export function clearFiles(): FilesActionTypes {
  return { type: CLEAR_FILES };
}

export function queueFiles(): FilesActionTypes {
  return { type: QUEUE_FILES };
}

export function fileSuccess(file: AppFile): FilesActionTypes {
  return { type: FILE_SUCCESS, file };
}

export function fileError(file: AppFile, error: Error): FilesActionTypes {
  return { type: FILE_ERROR, file, error };
}

export function fileProcessing(file: AppFile): FilesActionTypes {
  return { type: FILE_PROCESSING, file };
}
