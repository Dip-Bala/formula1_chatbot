"use client";

import Image from "next/image";
import { PromtSuggestionsRow } from "./components/PromtSuggestionsRow";
import { LoadingBubble } from "./components/LoadingBubble";
import { UIMessage, useChat, useCompletion } from "@ai-sdk/react";
import { Bubble } from "./components/Bubble";

export default function Home() {
  const {isLoading, input, handleSubmit, handleInputChange} = useCompletion();
  const {messages, sendMessage, status } = useChat({});
  const noMessages = !messages || messages.length === 0
  const handlePromt=(promtText: string) => {
      const msg = {
        id: crypto.randomUUID(),
        role: 'user',
        metadata: {
          content: promtText
        }
      }
      
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-4xl flex-col bg-white dark:bg-black sm:items-start py-8 justify-between items-center">
        <Image
          // className="dark:invert"
          src="/formula 1.avif"
          alt="Next.js logo"
          width={900}
          height={20}
        />
        <section>
          {
            noMessages ? (
              <>
              <p>
                The ultimate place to get latest answers for all your F1 questions.
              </p>
              <br/>
              <PromtSuggestionsRow handlePromt={handlePromt}/>
              </>
            ): (
              <>
              {/* map messages into text bubbles */}
              {messages.map((message, index) => <Bubble  key={`message-${index}`} message={message}/>)}
              {isLoading && <LoadingBubble/>}
              </>
            )
          }
          <form onSubmit={handleSubmit} className="flex justify-between w-full gap-4">
            <input type="text" onChange={handleInputChange} placeholder="Ask me something..." className="w-full border border-zinc-700 rounded-full px-6 py-4 bg-zinc-900"/>
            <input type="submit" className="border border-zinc-700 rounded-full px-6 py-4 bg-zinc-900 "/>
          </form>
        </section>
      </main>
    </div>
  );
}


