import React from "react";

export interface useClipboardProps {
  timeout?: number;
}

export function useClipboard(timeout: number = 2000) {
  const [isCopied, setCopied] = React.useState(false);

  const copy = (value: string) => {
    if (typeof window === "undefined" || !navigator.clipboard?.writeText) {
      return;
    }

    if (!value) return;

    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, timeout);
    });
  };

  return { isCopied, copy };
}
