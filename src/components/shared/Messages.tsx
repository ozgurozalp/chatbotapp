import { Message } from "@/actions";
import { Bot, User } from "lucide-react";
import { forwardRef } from "react";

interface Props {
  messages: Message[];
}

const Messages = forwardRef<HTMLDivElement, Props>((props, ref) => {
  return (
    <div ref={ref} className="flex flex-col gap-2">
      {(props?.messages ?? []).map((message, index) => (
        <div
          className="text-white items-center flex gap-2 border-b border-[#27272a] pb-2 last:border-none last:pb-0"
          key={index}
        >
          {message.role === "user" ? (
            <User className="size-5 shrink-0 self-start" />
          ) : (
            <Bot className="size-5 shrink-0 self-start" />
          )}
          {message.content}
        </div>
      ))}
    </div>
  );
});

Messages.displayName = "Messages";

export default Messages;
