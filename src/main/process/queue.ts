import PQueue from 'p-queue';
import os from 'os';

const queue = new PQueue({ concurrency: os.cpus().length });

async function handlePromises(promises: any[]): Promise<any> {
  return Promise.all(
    promises.map((promise, i) =>
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

async function addFiles() {
  return handlePromises();
}
