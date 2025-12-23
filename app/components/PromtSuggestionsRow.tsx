import { PromtSuggestionsButton } from "./PromptSuggestionsButton";

interface PromtSuggestionsRowProps {
  handlePromt: (promtText: string) => void;
}

export function PromtSuggestionsRow({ handlePromt }: PromtSuggestionsRowProps) {
  const prompts = [
    "Who won the most F1 championships?",
    "Who is the highest-paid F1 driver right now?",
    "Which F1 team is fastest this season?",
    "Explain DRS like I’m new to F1",
    "Why is Red Bull so dominant in recent years?",
    "How does F1 qualifying actually work?",
  ];

  return (
    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {prompts.map((prompt, index) => (
        <PromtSuggestionsButton
          key={`suggestion-${index}`}
          text={prompt}
          onClick={handlePromt}
        />
      ))}
    </div>
  );
}
