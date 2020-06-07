/* tslint:disable */

/**
 * The MIT License

Project jumpstarted using kriasoft/babel-starter-kit, which is 
Copyright (c) 2015-2016 Konstantin Tarkus, Kriasoft LLC. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

import mime from 'mime-types';
import { AppFile } from '../store/files/types';

interface FileSystemEntry {
  isDirectory: boolean;
  isFile: boolean;
}

interface FileSystemDirectoryReader {
  readEntries(
    successCallback: (result: FileSystemEntry[]) => void,
    errorCallback?: (error: DOMError) => void
  ): void;
}

interface FileSystemFlags {
  create?: boolean;
  exclusive?: boolean;
}

interface FileSystemDirectoryEntry extends FileSystemEntry {
  isDirectory: true;
  isFile: false;
  createReader(): FileSystemDirectoryReader;
  getFile(
    path?: string,
    options?: FileSystemFlags,
    successCallback?: (result: FileSystemFileEntry) => void,
    errorCallback?: (error: DOMError) => void
  ): void;
  getDirectory(
    path?: string,
    options?: FileSystemFlags,
    successCallback?: (result: FileSystemDirectoryEntry) => void,
    errorCallback?: (error: DOMError) => void
  ): void;
}

interface FileSystemFileEntry extends FileSystemEntry {
  isDirectory: false;
  isFile: true;
  file(cb: (file: File) => void): void;
}

const DEFAULT_FILES_TO_IGNORE = [
  '.DS_Store', // OSX indexing file
  'Thumbs.db', // Windows indexing file
];

function shouldIgnoreFile(file) {
  return DEFAULT_FILES_TO_IGNORE.indexOf(file.name) >= 0;
}

function traverseDirectory(entry: any): Promise<any> {
  const reader = entry.createReader();
  // Resolved when the entire directory is traversed
  return new Promise((resolveDirectory: any) => {
    const iterationAttempts: any[] = [];
    const readEntries = () => {
      // According to the FileSystem API spec, readEntries() must be called until
      // it calls the callback with an empty array.
      reader.readEntries(
        (batchEntries) => {
          if (!batchEntries.length) {
            // Done iterating this particular directory
            resolveDirectory(Promise.all(iterationAttempts));
          } else {
            // Add a list of promises for each directory entry.  If the entry is itself
            // a directory, then that promise won't resolve until it is fully traversed.
            iterationAttempts.push(
              Promise.all(
                batchEntries.map((batchEntry) => {
                  if (batchEntry.isDirectory) {
                    return traverseDirectory(batchEntry);
                  }
                  return Promise.resolve(batchEntry);
                })
              )
            );
            // Try calling readEntries() again for the same dir, according to spec
            readEntries();
          }
        },
        (err) => {
          throw new Error(err.toString());
        }
      );
    };
    // initial call to recursive entry reader function
    readEntries();
  });
}

// package the file in an object that includes the fullPath from the file entry
// that would otherwise be lost
function packageFile(file: any, entry?: any): AppFile {
  let mimeType: string | false | undefined = mime.lookup(file.name);
  if (mimeType === false) {
    mimeType = undefined;
  }

  return {
    fileObject: file, // provide access to the raw File object (required for uploading)
    path: file.path,
    lastModified: file.lastModified,
    lastModifiedDate: file.lastModifiedDate,
    name: file.name,
    size: file.size,
    type: file.type ? file.type : mimeType,
    webkitRelativePath: file.webkitRelativePath,
  };
}

function getFile(entry) {
  return new Promise((resolve) => {
    entry.file((file) => {
      resolve(packageFile(file, entry));
    });
  });
}

function handleFilePromises(promises: Promise<any>[], fileList: Array<DataTransferItem>) {
  return Promise.all(promises).then((files) => {
    files.forEach((file) => {
      if (!shouldIgnoreFile(file)) {
        fileList.push(file);
      }
    });
    return fileList;
  });
}

export function getDataTransferFiles(dataTransfer: DataTransfer): Promise<any> {
  const dataTransferFiles: Array<DataTransferItem> = [];
  const folderPromises: Array<Promise<any>> = [];
  const filePromises: Array<Promise<any>> = [];

  [].slice.call(dataTransfer.items).forEach((listItem: DataTransferItem) => {
    if (typeof listItem.webkitGetAsEntry === 'function') {
      const entry = listItem.webkitGetAsEntry();

      if (entry) {
        if (entry.isDirectory) {
          folderPromises.push(traverseDirectory(entry));
        } else {
          filePromises.push(getFile(entry));
        }
      }
    } else {
      dataTransferFiles.push(listItem);
    }
  });

  if (folderPromises.length) {
    const flatten = <T>(array: Array<T>): Array<T> =>
      array.reduce(
        (a: Array<T>, b: Array<T> | T) => a.concat(Array.isArray(b) ? flatten(b) : b),
        []
      );

    return Promise.all(folderPromises).then((fileEntries) => {
      const flattenedEntries = flatten(fileEntries);
      // collect async promises to convert each fileEntry into a File object
      flattenedEntries.forEach((fileEntry) => {
        filePromises.push(getFile(fileEntry));
      });
      return handleFilePromises(filePromises, dataTransferFiles);
    });
  }

  if (filePromises.length) {
    return handleFilePromises(filePromises, dataTransferFiles);
  }

  return Promise.resolve(dataTransferFiles);
}

/**
 * This function should be called from both the onDrop event from your drag/drop
 * dropzone as well as from the HTML5 file selector input field onChange event
 * handler.  Pass the event object from the triggered event into this function.
 * Supports mix of files and folders dropped via drag/drop.
 *
 * Returns: an array of File objects, that includes all files within folders
 *   and subfolders of the dropped/selected items.
 */
export function getDroppedOrSelectedFiles(event: any): Promise<any> {
  const { dataTransfer } = event;
  if (dataTransfer && dataTransfer.items) {
    return getDataTransferFiles(dataTransfer).then((fileList) => {
      return Promise.resolve(fileList);
    });
  }
  const files = [];
  const dragDropFileList = dataTransfer && dataTransfer.files;
  const inputFieldFileList = event.target && event.target.files;
  const fileList = dragDropFileList || inputFieldFileList || [];
  // convert the FileList to a simple array of File objects
  for (let i = 0; i < fileList.length; i += 1) {
    files.push(packageFile(fileList[i]));
  }
  return Promise.resolve(files);
}
