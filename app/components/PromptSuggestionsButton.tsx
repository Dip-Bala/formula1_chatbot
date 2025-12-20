interface PromtSuggestionsButtonProp{
    text: string
    onClick: (promtText: string) => void
}


export function PromtSuggestionsButton({text, onClick}: PromtSuggestionsButtonProp){
    return (
        <button onClick={() => onClick(text)}>
            {text}
        </button>
    )
}