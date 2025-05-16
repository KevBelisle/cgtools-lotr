async function tryGetFromOpfs(
  fileUrl: string
): Promise<false | { buffer: Uint8Array; source: "opfs" }> {
  const opfsRoot = await navigator.storage.getDirectory();

  try {
    const fileHandle = await opfsRoot.getFileHandle(fileUrl, {
      create: false,
    });
    const file = await fileHandle.getFile();
    const buffer = await file.arrayBuffer();
    return { buffer: new Uint8Array(buffer), source: "opfs" };
  } catch (error) {
    if (error instanceof Error && error.name === "NotFoundError") {
      // File not found in OPFS
      return false;
    }
    throw error;
  }
}

export default async function* loadFile(
  dbFileUrl: string,
  checkOpfs: boolean = true
): AsyncGenerator<
  number,
  { buffer: Uint8Array; source: "opfs" | "fetch" },
  void
> {
  if (checkOpfs) {
    const opfsResult = await tryGetFromOpfs(dbFileUrl);
    if (opfsResult) {
      return opfsResult;
    }
  }

  // If the file doesn't exist, fetch it from the server
  const response = await fetch(dbFileUrl);
  const reader = response.body!.getReader();
  const contentLength = parseInt(response.headers!.get("Content-Length")!);

  let receivedLength = 0;
  let buffer = new Uint8Array(contentLength);

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    buffer.set(value, receivedLength);
    receivedLength += value.length;

    yield (receivedLength / contentLength) * 100;
  }

  return {
    buffer: buffer,
    source: "fetch",
  };
}
