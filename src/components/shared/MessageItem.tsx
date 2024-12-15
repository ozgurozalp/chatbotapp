import { Bot, User } from "lucide-react";
import { Message } from "ai";
import Markdown from "react-markdown";

export default function MessageItem({ message }: { message: Message }) {
  const Icon = message.role === "user" ? User : Bot;
  return (
    <div className="items-center flex gap-2 border-b pb-2 last:border-none last:pb-0">
      <Icon className="size-5 shrink-0 self-start" />
      <Markdown className="prose dark:prose-invert">{message.content}</Markdown>
    </div>
  );
}
