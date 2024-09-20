"use client";

import dynamic from "next/dynamic";

const ChatScreen = dynamic(() => import("@/components/shared/ChatScreen"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto">
      <ChatScreen />
    </div>
  );
}
