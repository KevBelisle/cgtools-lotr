const saveToOpfsWorker = async ({
  filename,
  array,
}: {
  filename: string;
  array: Uint8Array;
}) => {
  try {
    const root = await navigator.storage.getDirectory();
    try {
      await root.removeEntry(filename);
    } catch (e) {
      /* ignore */
    }
    const handle = await root.getFileHandle(filename, { create: true });
    // @ts-ignore
    const writer = await handle.createSyncAccessHandle();
    writer.write(array);
    writer.close();
  } catch (err) {
    throw err;
  }
};

async function doWorkerTask<T, K>(workerFunction: (input: K) => T, input: K) {
  const workFn = workerFunction.toString().replace('"use strict";', "");
  const workerString = `
      self.onmessage = async (e) => self.postMessage(await (${workFn})(e.data));`;
  const workerBlob = new Blob([workerString], {
    type: "application/javascript; charset=utf-8",
  });
  const workerBlobURL = window.URL.createObjectURL(workerBlob);

  return (await new Promise((resolve, reject) => {
    const worker = new Worker(workerBlobURL);
    worker.onmessage = (e) => {
      resolve(e.data);
    };
    worker.onerror = (e) => {
      reject(e.error);
      console.error(e);
    };
    worker.postMessage(input);
  })) as T;
}

export const saveToOpfs = async (filename: string, array: Uint8Array) => {
  return doWorkerTask(saveToOpfsWorker, { filename, array });
};
