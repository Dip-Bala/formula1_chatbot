"use client";

import Image from "next/image";
import { PromtSuggestionsRow } from "./components/PromtSuggestionsRow";
import { LoadingBubble } from "./components/LoadingBubble";
import { UIMessage, useChat } from "@ai-sdk/react";
import { Bubble } from "./components/Bubble";
import { FormEvent, useState } from "react";

export default function Home() {
  const { messages, sendMessage, status } = useChat({});
  const [input, setInput] = useState("");

  const noMessages = messages.length === 0;

  const handlePrompt = (promptText: string) => {
    sendMessage({ text: promptText });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Background Image */}
      <Image
        src="/formula 1.avif"
        alt="Formula 1"
        fill
        priority
        className="object-cover opacity-10"
      />

      {/* Overlay */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-between">
        {/* Header */}
        <header className="w-full max-w-4xl px-6 py-6">
          <h1 className="text-3xl font-bold tracking-tight text-red-700">
            F1 Insight
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            pit. pit. pit. — Ask anything Formula 1
          </p>
        </header>

        {/* Chat Area */}
        <main className="flex-1 w-full max-w-4xl  px-6 overflow-y-scroll ">
          {noMessages ? (
            <div className="mt-12">
              <p className="text-lg text-zinc-300 mb-6">
                The ultimate place to get accurate answers for all your F1
                questions.
              </p>
              <PromtSuggestionsRow handlePromt={handlePrompt} />
            </div>
          ) : (
            <div className="flex flex-col gap-4 h-6">
              {messages.map((message, index) => (
                <Bubble key={`message-${index}`} message={message} />
              ))}
              {status === "submitted" && <LoadingBubble />}
            </div>
          )}
        </main>

        {/* Input Bar */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-4xl px-6 pb-6 pt-4 bg-linear-to-t from-black via-black/90 to-transparent border-t border-black/50 "
        >
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask an F1 question..."
              className="flex-1 rounded-full bg-zinc-900 border border-zinc-700 px-6 py-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              type="submit"
              className="rounded-full bg-red-600 px-6 py-4 text-sm font-semibold hover:bg-red-700 transition"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
