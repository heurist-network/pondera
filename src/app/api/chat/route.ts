import { env } from "@/env.mjs";
import { ResError } from "@/lib/response";
import { stream } from "@/lib/stream";

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
