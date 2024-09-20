"use client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { readStreamableValue } from "ai/rsc";
import { continueConversation, Message } from "@/actions";
import Messages from "@/components/shared/Messages";
import { useScrollAnchor } from "@/lib/hooks";
import { useAnimate, m } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ChatScreen() {
  const [scope, animate] = useAnimate();
  const [conversation, setConversation] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const textarea = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState(false);
  const [hasBottomRadius, setHasBottomRadius] = useState(true);
  const { messagesRef, scrollRef, visibilityRef, scrollToBottom } =
    useScrollAnchor();

  function formOnSubmit(event: FormEvent) {
    event.preventDefault();
    submit();
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault();
      submit();
    }
  }

  function clearInput() {
    setInput("");
    textarea.current?.blur();
  }

  async function submit() {
    if (loading || input.trim().length === 0) return;

    clearInput();
    setLoading(true);
    const { messages, newMessage } = await continueConversation([
      ...conversation,
      { role: "user", content: input },
    ]);

    setConversation(messages);

    let textContent = "";

    for await (const delta of readStreamableValue(newMessage)) {
      textContent = `${textContent}${delta}`;

      setConversation([
        ...messages,
        { role: "assistant", content: textContent },
      ]);
    }
    setLoading(false);
  }

  useEffect(() => {
    scrollToBottom();

    if (conversation.length > 0) {
      animate(
        scope.current,
        {
          inset: "auto",
          left: "50%",
          bottom: 0,
          transform: "translate(-50%, 0)",
        },
        {
          ease: "linear",
          onComplete() {
            setHasBottomRadius(false);
          },
        },
      );
    }
  }, [conversation]);

  return (
    <div className="h-dvh flex flex-col gap-4">
      <div
        ref={scrollRef}
        className="py-4 flex-1 overflow-auto px-6 sm:px-0"
        style={{ maxHeight: "calc(100dvh - 98px)" }}
      >
        <Messages ref={messagesRef} messages={conversation} />
        <div className="w-full h-px" ref={visibilityRef} />
      </div>
      <m.div
        initial={{
          position: "fixed",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
        ref={scope}
        className={cn(
          hasBottomRadius ? "rounded-xl" : "rounded-t-xl",
          "bg-black mt-auto p-6 h-fit max-w-3xl w-full",
        )}
      >
        <form
          onSubmit={formOnSubmit}
          className="h-fit bg-[#18181a] border border-[#27272a] grid grid-cols-[1fr_auto] gap-2 rounded-md"
        >
          <Textarea
            ref={textarea}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder={loading ? "Responding..." : "Type a message"}
            className="bg-transparent border-none text-white resize-none self-center"
          />
          <div className="self-end p-1">
            <Button
              variant="secondary"
              disabled={loading}
              className="rounded"
              type="submit"
              size="icon-xs"
            >
              <Send className="size-4" />
            </Button>
          </div>
        </form>
      </m.div>
    </div>
  );
}
