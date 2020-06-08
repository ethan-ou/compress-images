export interface AppFile {
  id?: string;
  lastModified: number;
  lastModifiedDate?: Date;
  name: string;
  path: string;
  size: number;
  type: string;
  webkitRelativePath?: string;
  status?: FileStatus;
  fileObject?: any;
}

export type FileStatus = 'Waiting' | 'Queued' | 'Processing' | 'Completed' | 'Failed';
