
interface BubbleProp {
    message: any
}

export function Bubble({message}: BubbleProp){
    const {content, role} = message;
    return (
        <div>{content}</div>
    )
}