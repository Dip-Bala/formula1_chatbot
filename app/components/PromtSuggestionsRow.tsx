import { PromtSuggestionsButton } from "./PromptSuggestionsButton";

interface PromtSuggestionsRowProps {
  handlePromt: (promtText: string) => void;
}

export function PromtSuggestionsRow({ handlePromt }: PromtSuggestionsRowProps) {
 const promts = [
  "Who is leading the 2025 F1 championship?",
  "Explain Red Bull’s race strategy advantage",
  "Who are the top rookies this season?",
  "What happened in the last Grand Prix?",
  "Compare Verstappen and Hamilton careers",
  "Which team has the fastest pit stops?",
];


  return (
    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {promts.map((promt, index) => (
        <PromtSuggestionsButton
          key={`suggestion-${index}`}
          text={promt}
          onClick={handlePromt}
        />
      ))}
    </div>
  );
}
