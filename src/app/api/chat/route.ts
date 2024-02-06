import { env } from "@/env.mjs";
import { ResError } from "@/lib/response";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const stream = async (
  readable: ReadableStream,
  writable: WritableStream
) => {
  const reader = readable.getReader();
  const writer = writable.getWriter();

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const newline = "\n";
  const delimiter = "\n\n";
  const encodedNewline = encoder.encode(newline);

  let buffer = "";

  try {
    while (true) {
      let { value, done } = await reader.read();
      if (done) {
        break;
      }
      buffer += decoder.decode(value, { stream: true }); // stream: true is important here,fix the bug of incomplete line
      let lines = buffer.split(delimiter);

      // Loop through all but the last line, which may be incomplete.
      for (let i = 0; i < lines.length - 1; i++) {
        await writer.write(encoder.encode(lines[i] + delimiter));
        await sleep(20);
      }

      buffer = lines[lines.length - 1];
    }

    if (buffer) {
      await writer.write(encoder.encode(buffer));
    }

    await writer.write(encodedNewline);
    await writer.close();
  } catch {}
};

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    console.log("---------------------------------");
    console.log("\n\n");
    console.log(messages, "messages");
    console.log("\n\n");
    console.log("---------------------------------");

    const response = await fetch(
      "https://openai-proxy.replicate.com/v1/chat/completions",
      {
        headers: {
          Authorization: `Bearer ${env.MISTRAL_API_KEY}`,
        },
        method: "POST",
        body: JSON.stringify({
          model: "meta/llama-2-70b-chat",
          stream: true,
          messages,
        }),
      }
    );

    const { readable, writable } = new TransformStream();

    stream(response.body as ReadableStream, writable);

    return new Response(readable, {
      ...response,
      headers: {
        "Content-Type": "text/event-stream",
      },
    });
  } catch (error) {
    console.log(error, "api/chat error");
    return ResError({ msg: "api/chat error", data: error });
  }
}
