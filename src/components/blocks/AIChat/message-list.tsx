import React, { useEffect, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { ChatMessage } from "@/types/aichat"
import { LoadingDots } from "./loading-dots"

interface MessageListProps {
    messages: ChatMessage[]
    isLoading: boolean
    messagesEndRef: React.RefObject<HTMLDivElement>
}

export function MessageList({ messages, isLoading, messagesEndRef }: MessageListProps) {
    const [typedMessage, setTypedMessage] = useState("")

    useEffect(() => {
        if (!isLoading && messages.length > 0) {
            const lastMessage = messages[messages.length - 1]
            if (lastMessage?.ai) {
                let index = 0
                setTypedMessage("")
                const interval = setInterval(() => {
                    setTypedMessage((prev) => prev + lastMessage.ai[index])
                    index++
                    if (index >= lastMessage.ai.length) {
                        clearInterval(interval)
                    }
                }, 5)
                return () => clearInterval(interval)
            }
        }
    }, [messages, isLoading])

    return (
        <ScrollArea className="h-full px-4">
            <div className="py-4 space-y-4">
                {messages.map((message, index) => {
                    const isLast = index === messages.length - 1
                    return (
                        <div key={index} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {message.user && (
                                <div className="flex justify-end">
                                    <div className="max-w-[80%] p-2.5 text-sm rounded-2xl rounded-tr-sm bg-primary text-card shadow-sm">
                                        {message.user}
                                    </div>
                                </div>
                            )}
                            {message.ai && (
                                <div className="flex justify-start">
                                    <div className="max-w-[80%] p-2.5 text-sm rounded-2xl rounded-tl-sm bg-secondary text-muted-foreground shadow-sm whitespace-pre-wrap">
                                        {isLast ? typedMessage : message.ai}
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
                {isLoading && (
                    <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="max-w-[85%] p-3.5 rounded-2xl rounded-tl-sm bg-secondary text-muted-foreground shadow-sm">
                            <div className="flex items-center space-x-3">
                                <LoadingDots />
                                <span className="text-sm font-medium">Đang tạo phân khúc...</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
        </ScrollArea>
    )
}
