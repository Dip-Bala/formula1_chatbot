export function LoadingBubble(){
    return (
        <div className="flex gap-4 items-center">
            <span className="before:w-3 before:h-3 animate-ping before:rounded-full before:content-[''] before:inline-block  before:bg-zinc-500 delay-1000 transition-all duration-100 ease-linear"></span>
            <span className="before:w-3 before:h-3 animate-ping before:rounded-full before:content-[''] before:inline-block before:bg-zinc-500 delay-5000"></span>
            <span className="before:w-3 before:h-3 animate-ping before:rounded-full before:content-[''] before:inline-block  before:bg-zinc-500 delay-400"></span>

        </div>
    )
}