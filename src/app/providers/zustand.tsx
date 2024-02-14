"use client";

import { useChatStore } from "@/store/chat";

export function ZunstandProvider({ children }: { children: React.ReactNode }) {
  const hasHydrated = useChatStore((state) => state._hasHydrated);

  if (!hasHydrated) return null;

  return children;
}
