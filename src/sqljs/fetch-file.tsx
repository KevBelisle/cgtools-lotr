export default async function* loadFile(
  dbFileUrl: string,
): AsyncGenerator<number, Uint8Array, void> {
  const response = await fetch(dbFileUrl);
  const reader = response.body!.getReader();
  const contentLength = parseInt(response.headers!.get("Content-Length")!);

  let receivedLength = 0;
  let buffer = new Uint8Array(contentLength);

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      if (receivedLength < buffer.byteLength) {
        buffer = buffer.subarray(0, receivedLength);
      }
      break;
    }

    if (receivedLength + value.length > buffer.byteLength) {
      buffer = resizeUint8Array(buffer, buffer.byteLength * 2);
    }
    buffer.set(value, receivedLength);
    receivedLength += value.length;

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
