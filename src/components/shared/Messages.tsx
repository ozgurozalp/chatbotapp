import { Message } from "@/actions";
import { forwardRef } from "react";
import MessageItem from "@/components/shared/MessageItem";

interface Props {
  messages: Message[];
}

const Messages = forwardRef<HTMLDivElement, Props>((props, ref) => {
  return (
    <div ref={ref} className="flex flex-col gap-2">
      {(props?.messages ?? []).map((message, index) => (
        <MessageItem message={message} key={index} />
      ))}
    </div>
  );
});

Messages.displayName = "Messages";

export default Messages;
