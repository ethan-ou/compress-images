export const ADD_FILES = "ADD_FILES"
export const REMOVE_FILES = "REMOVE_FILES"
export const SELECT_FILES = "SELECT_FILES"
export const CLEAR_FILES = "CLEAR_FILES"

// TODO: Remove files: any and confirm event type.

export type FileStatus = "Waiting" | "Queued" | "Processing" | "Completed" | "Failed"

export type FileEvent = React.DragEvent | React.MouseEvent | React.KeyboardEvent

export interface AppFile {
    id?: string
    lastModified: number
    lastModifiedDate?: Date
    name: string
    path: string
    size: number
    type: string
    webkitRelativePath?: string
    status?: FileStatus
    fileObject?: any
}

export interface FilesState {
    files: AppFile[]
    selected: {
        items: number[]
        pivot: number | null
    }
}

interface AddFilesAction {
    type: typeof ADD_FILES
    files: AppFile[]
    status: FileStatus
}

interface RemoveFilesAction {
    type: typeof REMOVE_FILES
}

interface SelectFilesAction {
    type: typeof SELECT_FILES
    event: FileEvent
    index: number | null
}

interface ClearFilesAction {
    type: typeof CLEAR_FILES
}

export type FilesActionTypes = AddFilesAction | RemoveFilesAction | SelectFilesAction | ClearFilesAction