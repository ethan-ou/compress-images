import Queue from 'p-queue';
import os from 'os';
import processFile from './process';
import { AppFile } from '../../types';

const queue = new Queue({ concurrency: os.cpus().length });

async function createProcess(
  files: AppFile[],
  options: any,
  onSuccess: (arg0: AppFile, ...args: any) => void,
  onError: (arg0: Error, ...args: any) => void
): Promise<any> {
  const promises = files.map(async (file) =>
    queue
      .add(async () => processFile(file.path, options.outputPath, file, options.settings))
      .then((item, ...args) => onSuccess(item, ...args))
      .catch((error: Error, ...args) => onError(error, ...args))
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

async function endProcess(): Promise<void> {
  return queue.clear();
}

export default {
  create: createProcess,
  pause: pauseProcess,
  end: endProcess,
};
