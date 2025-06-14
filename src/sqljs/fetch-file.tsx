export default async function* loadFile(
  dbFileUrl: string,
): AsyncGenerator<number, Uint8Array, void> {
  const response = await fetch(dbFileUrl);
  const reader = response.body!.getReader();
  const contentLength = parseInt(response.headers!.get("Content-Length")!);

  let receivedLength = 0;
  let buffer = new Uint8Array(contentLength);

  console.log(`Downloading file from ${dbFileUrl}...`);
  console.log(`Content-Length: ${contentLength} bytes`);
  console.log(`Buffer size: ${buffer.length} bytes`);
  console.log(`Receiving data...`);

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      console.log(
        `Download complete. Total received: ${receivedLength} bytes.`,
      );
      if (receivedLength < buffer.byteLength) {
        console.warn(
          `Trimming buffer from ${buffer.byteLength} to ${receivedLength}...`,
        );
        buffer = buffer.subarray(0, receivedLength);
      }
      break;
    }

    const newReceivedLength = receivedLength + value.length;

    if (newReceivedLength > buffer.byteLength) {
      console.warn(
        `Received data exceeds buffer size. Increasing buffer size...`,
      );
      buffer = resizeUint8Array(buffer, newReceivedLength * 2);
    }
    buffer.set(value, receivedLength);
    receivedLength = newReceivedLength;

    console.log(`Received ${receivedLength} bytes.`);

    yield (receivedLength / contentLength) * 100;
  }

  return buffer;
}

function resizeUint8Array(
  originalArray: Uint8Array,
  newSize: number,
): Uint8Array<ArrayBuffer> {
  const newArray = new Uint8Array(newSize);
  newArray.set(
    originalArray.subarray(0, Math.min(originalArray.length, newSize)),
  );
  return newArray;
}
