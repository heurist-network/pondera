import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAIStore, type OpenAI } from "@/hooks/useAI";

export default function OpenAI() {
  const openai = useAIStore((state) => state.openai);

  const updateOpenAI = useAIStore((state) => state.updateOpenAI);

  const onChange = (value: string, key: keyof OpenAI) => {
    updateOpenAI({ ...openai, [key]: value });
  };

  return (
    <>
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="apiKey">API Key</Label>
        <Input
          id="apiKey"
          className="h-9"
          placeholder="sk-xxxxxxxxxxxxxxxxxxxx"
          value={openai.apiKey}
          onChange={(e) => onChange(e.target.value, "apiKey")}
        />
      </div>
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="proxy">API Proxy</Label>
        <Input
          id="proxy"
          className="h-9"
          placeholder="https://api.openai.com/v1"
          value={openai.proxy}
          onChange={(e) => onChange(e.target.value, "proxy")}
        />
      </div>
    </>
  );
}
