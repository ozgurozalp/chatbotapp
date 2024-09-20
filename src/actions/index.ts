"use server";

import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { createStreamableValue } from "ai/rsc";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function continueConversation(history: Message[]) {
  "use server";

  const stream = createStreamableValue();

  (async () => {
    const { textStream } = await streamText({
      model: openai("gpt-3.5-turbo"),
      system: `You are an advanced AI chatbot designed to assist users with a wide range of inquiries by providing accurate, clear, and helpful responses in a friendly and professional manner. Your role is to create a positive user experience by engaging in natural, flowing conversations, offering insightful answers, and solving problems with empathy and transparency. Tailor your responses based on the user's level of knowledge and preferences, adapting to different contexts and topics with ease. Be mindful of your limitations, and always strive to offer the most relevant and up-to-date information.`,
      messages: history,
    });

    for await (const text of textStream) {
      stream.update(text);
    }

    stream.done();
  })();

  return {
    messages: history,
    newMessage: stream.value,
  };
}
