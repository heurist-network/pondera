import RemarkMath from "remark-math";
import RemarkBreaks from "remark-breaks";
import RehypeKatex from "rehype-katex";
import RemarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { CodeBlock } from "./codeBlock";
import { MemoizedReactMarkdown } from "./reactMarkdown";

export function ChatContent({ content }: { content: string }) {
  return (
    <MemoizedReactMarkdown
      className="prose dark:prose-invert"
      remarkPlugins={[RemarkGfm, RemarkMath, RemarkBreaks]}
      rehypePlugins={[RehypeKatex]}
      components={{
        code(props) {
          const { children, className } = props;
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            <CodeBlock
              value={String(children).replace(/\n$/, "")}
              language={match[1]}
            />
          ) : (
            <code className={className}>{children}</code>
          );
        },
        table({ children }) {
          return (
            <table className="border-collapse border border-black py-1 px-3 dark:border-white">
              {children}
            </table>
          );
        },
        th({ children }) {
          return (
            <th
              className={cn(
                "border border-black bg-gray-500 text-white py-1 px-3 break-words",
                "dark:bg-gray-700 dark:border-white/70"
              )}
            >
              {children}
            </th>
          );
        },
        td({ children }) {
          return (
            <td className="border border-black py-1 px-3 break-words dark:border-white/70">
              {children}
            </td>
          );
        },
      }}
    >
      {content}
    </MemoizedReactMarkdown>
  );
}
