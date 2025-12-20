import { PromtSuggestionsButton } from "./PromptSuggestionsButton"
interface PromtSuggestionsRowProps {
  handlePromt: (promtText: string) => void;
}


export function PromtSuggestionsRow({handlePromt} : PromtSuggestionsRowProps){

    const promts = [
        "Who is the head of racing for Aston Martin's F1 academy Team",
        "Who is the highest paid F1 driver?",
        "Who won the most F1 championships?",
        "What are the salary range F1 drivers?"
    ]
    return (
        <div className="">
            {
                promts.map((promt, index) => <PromtSuggestionsButton key={`suggestion-${index}`} text={promt} onClick={() => handlePromt(promt)}/>)
            }

        </div>
    )
}