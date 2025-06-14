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
      break;
    }

    buffer.set(value, receivedLength);
    receivedLength += value.length;

    console.log(`Received ${receivedLength} bytes.`);

    yield (receivedLength / contentLength) * 100;
  }

  return buffer;
}
