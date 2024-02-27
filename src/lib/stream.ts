function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const stream = async (
  readable: ReadableStream,
  writable: WritableStream,
) => {
  const reader = readable.getReader()
  const writer = writable.getWriter()

  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  const newline = '\n'
  const delimiter = '\n\n'
  const encodedNewline = encoder.encode(newline)

  let buffer = ''

  try {
    while (true) {
      let { value, done } = await reader.read()
      if (done) {
        break
      }
      buffer += decoder.decode(value, { stream: true }) // stream: true is important here,fix the bug of incomplete line
      let lines = buffer.split(delimiter)

      // Loop through all but the last line, which may be incomplete.
      for (let i = 0; i < lines.length - 1; i++) {
        await writer.write(encoder.encode(lines[i] + delimiter))
        await sleep(5)
      }

      buffer = lines[lines.length - 1]
    }

    if (buffer) {
      await writer.write(encoder.encode(buffer))
    }

    await writer.write(encodedNewline)
    await writer.close()
  } catch {}
}
