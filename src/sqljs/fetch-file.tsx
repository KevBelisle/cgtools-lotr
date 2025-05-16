export default async function* loadFile(
  dbFileUrl: string
): AsyncGenerator<number, Uint8Array, void> {
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

  return buffer;
}
