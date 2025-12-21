import { UIMessage } from "@ai-sdk/react";

interface BubbleProp {
    message: UIMessage
}

export function Bubble({message}: BubbleProp){
    return (
        <div>{message.parts[0].text}</div>
    )
}