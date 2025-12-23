interface PromtSuggestionsButtonProp {
  text: string;
  onClick: (promtText: string) => void;
}

export function PromtSuggestionsButton({
  text,
  onClick,
}: PromtSuggestionsButtonProp) {
  return (
    <button
      onClick={() => onClick(text)}
      className="
        rounded-full 
        border border-zinc-700 
        bg-zinc-900 
        px-5 py-2.5 
        text-sm text-zinc-200 
        transition-all 
        hover:border-red-500 
        hover:bg-zinc-800 
        hover:text-white
        active:scale-95
      "
    >
      {text}
    </button>
  );
}
