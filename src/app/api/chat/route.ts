import { env } from "@/env.mjs";
import { ResError } from "@/lib/response";
import { stream } from "@/lib/stream";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages, modelId, temperature, stream: useStream } = await req.json();

    console.log("---------------------------------");
    console.log("\n\n");
    console.log(messages, "messages");
    console.log("\n\n");
    console.log("---------------------------------");

    const response = await fetch(
      "https://llm-gateway.heurist.xyz/v1/chat/completions",
      {
        headers: {
          Authorization: `Bearer ${env.HEURIST_AUTH_KEY}`,
        },
        method: "POST",
        body: JSON.stringify({
          model: modelId,
          stream: useStream || false,
          messages,
          temperature: temperature || 0.75,
          max_tokens: 4000
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
