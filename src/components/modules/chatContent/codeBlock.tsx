import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";
import { useClipboard } from "@/hooks/useClipboard";

function CopyToClipboard({ content }: { content: string }) {
  const { isCopied, copy } = useClipboard();

  const onCopy = () => {
    if (isCopied) return;
    copy(content);
  };

  return (
    <div
      className={cn(
        "transition-all opacity-0 group-hover/codeblock:opacity-100",
        "box-content cursor-pointer absolute w-4 h-4 p-1.5 right-3 top-11 rounded-md flex justify-center items-center",
        "border border-white/10 bg-[#33424d] text-[rgb(156,163,175)] hover:text-[rgb(249,250,251)]"
      )}
      onClick={onCopy}
    >
      <span
        className={cn("h-4 w-4", {
          "i-mingcute-copy-2-line": !isCopied,
          "i-mingcute-check-line": isCopied,
        })}
      />
    </div>
  );
}

export function CodeBlock({
  language,
  value,
}: {
  language: string;
  value: string;
}) {
  return (
    <div className="codeblock relative group/codeblock">
      <div className="px-4 py-2 text-xs leading-[18px] bg-[#2d3c47]">
        <div className="capitalize">{language}</div>
      </div>
      <CopyToClipboard content={value} />
      <SyntaxHighlighter
        style={oneDark}
        language={language}
        PreTag="div"
        customStyle={{
          margin: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}
