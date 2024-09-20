import { Bot, User } from "lucide-react";
import { Message } from "@/actions";

export default function MessageItem({ message }: { message: Message }) {
  const Icon = message.role === "user" ? User : Bot;
  return (
    <div className="text-white items-center flex gap-2 border-b border-[#27272a] pb-2 last:border-none last:pb-0">
      <Icon className="size-5 shrink-0 self-start" />
      {message.content}
    </div>
  );
}
