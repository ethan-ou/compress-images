import Queue from 'p-queue';
import os from 'os';
import processFile from './process';
import { AppFile } from '../../types';

const queue = new Queue({ concurrency: os.cpus().length });

async function createProcess(
  files: AppFile[],
  options: any,
  onProcessing: (arg0: AppFile) => void,
  onSuccess: (arg0: AppFile) => void,
  onError: (arg0: AppFile, arg1: Error) => void
): Promise<any> {
  const promises = files.map(async (file) =>
    queue
      .add(async () => {
        onProcessing(file);
        return processFile(file.path, options.outputPath, file, options.settings);
      })
      .then(() => onSuccess(file))
      .catch((error: Error) => onError(file, error))
  );

  return Promise.all(
    promises.map((promise) =>
      promise
        .then((value: any) => ({
          status: 'fulfilled',
          value,
        }))
        .catch((reason: any) => ({
          status: 'rejected',
          reason,
        }))
    )
  );
}

async function pauseProcess(): Promise<void> {
  return queue.pause();
}

async function cancelProcess(): Promise<void> {
  return queue.clear();
}

export default {
  create: createProcess,
  pause: pauseProcess,
  cancel: cancelProcess,
};
