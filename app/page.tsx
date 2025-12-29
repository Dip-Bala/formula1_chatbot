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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#ff000020,_transparent_60%)] pointer-events-none" />

      {/* <Image
        src="/logo2.png"
        alt="Formula 1"
        fill
        priority
        className="object-cover opacity-20"
      /> */}

      {/* Overlay */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-between">
        {/* Header */}
        <header className="w-full max-w-5xl mx-auto px-6 pt-6 pb-4 flex items-center justify-between">
  <div className="flex items-center gap-3">
    {/* Logo mark */}
    <div className="flex items-center gap-2">
      <div className="w-3 h-8 bg-red-600 rounded-sm" />
      <h1 className="text-2xl font-extrabold tracking-tight">
        <span className="text-red-600">F1</span>
        <span className="text-white">INSIGHT</span>
      </h1>
    </div>

    <span className="hidden sm:inline text-xs text-zinc-400 tracking-wide ml-3">
      AI-powered Formula 1 intelligence
    </span>
  </div>

  <div className="text-xs text-zinc-500 hidden md:block">
    Powered by AI · Updated live
  </div>
</header>
<div className="mt-10 mb-6 text-center">
  <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
    Your <span className="text-red-500">Race Engineer</span> for Formula 1
  </h2>
  <p className="mt-3 text-zinc-400 max-w-xl mx-auto">
    Get instant insights on drivers, teams, strategies, and race weekends —
    powered by real data and AI reasoning.
  </p>
</div>



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
              className="rounded-full bg-red-600 px-6 py-4 text-sm font-semibold hover:bg-red-700 transition cursor-pointer"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
