import React from "react";
import { useInit } from "@/hooks/useInit";
import LoadingPage from "@/components/loadingPage";

export default function Test({ children }: { children: React.ReactNode }) {
  const isInit = useInit();
  if (!isInit) return <LoadingPage />;
  return <>{children}</>;
}
