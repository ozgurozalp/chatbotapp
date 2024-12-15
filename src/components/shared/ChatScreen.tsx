"use client";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import Messages from "@/components/shared/Messages";
import { useScrollToBottom } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { useChat } from "ai/react";

export default function ChatScreen() {
  const [containerRef, endRef] = useScrollToBottom<HTMLDivElement>();

  const { messages, input, setInput, append, isLoading } = useChat();

  return (
    <div className="h-dvh flex pb-2 flex-col gap-4">
      <div
        ref={containerRef}
        className="py-4 flex-1 overflow-auto px-6 sm:px-0"
        style={{ maxHeight: "calc(100dvh - 90px)" }}
      >
        <Messages messages={messages} />
        <div className="w-full h-px" ref={endRef} />
      </div>
      <div
        className={cn(
          "rounded-xl",
          "bg-black transition mt-auto p-6 h-fit max-w-3xl w-full",
        )}
      >
        <div className="h-fit bg-[#18181a] border border-[#27272a] grid grid-cols-[1fr_auto] gap-2 rounded-md">
          <input
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
            }}
            onKeyDown={async (event) => {
              if (event.key === "Enter") {
                setInput("");
                await append({ content: input, role: "user" });
              }
            }}
            readOnly={isLoading}
            placeholder={isLoading ? "Düşünüyor..." : "Sorunuzu yazın"}
            className="bg-transparent border-none text-white resize-none self-center outline-none px-2"
          />
          <div className="self-end p-1">
            <Button
              variant="secondary"
              disabled={isLoading}
              className="rounded"
              type="submit"
              size="icon-xs"
            >
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
