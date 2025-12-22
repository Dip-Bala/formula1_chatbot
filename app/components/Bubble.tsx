import { UIMessage } from "@ai-sdk/react";

interface BubbleProps {
  message: UIMessage;
}

export function Bubble({ message }: BubbleProps) {
  return (
    <div
      className={`max-w-[80%] rounded-xl px-4 py-3 mb-3 ${
        message.role === "user"
          ? "bg-red-700 text-white self-end"
          : "bg-zinc-800 text-white self-start"
      }`}
    >
      {message.parts
        .filter(part => part.type === "text")
        .map((part, idx) => (
          <span key={idx}>{part.text}</span>
        ))}
    </div>
  );
}
