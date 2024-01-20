"use client";

import React from "react";
import { useAIStore } from "@/hooks/useAI";
import { useScrollStore } from "@/hooks/useScroll";
import ChatList from "./chatList";
import ChatFooter from "./chatFooter";

export default function ChatSection() {
  const apiKey = useAIStore((state) => state.openai.apiKey);

  const scrollRef = React.useRef<HTMLDivElement>(null);

  const updateScrollEle = useScrollStore((state) => state.updateScrollEle);

  React.useEffect(() => {
    const dom = scrollRef.current;
    if (dom) {
      updateScrollEle(dom);
      requestAnimationFrame(() => dom.scrollTo(0, dom.scrollHeight));
    }
  }, [scrollRef.current]);

  if (!apiKey) return null;

  return (
    <div className="h-full relative">
      <div className="h-full overflow-y-auto pl-5 pr-10" ref={scrollRef}>
        <ChatList />
        <ChatFooter />
      </div>
    </div>
  );
}
