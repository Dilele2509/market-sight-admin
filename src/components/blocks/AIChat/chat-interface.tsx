"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import type { ChatMessage } from "@/types/aichat"
import { MessageList } from "./message-list"
import { MessageInput } from "./message-input"
import { useAiChatContext } from "@/context/AiChatContext"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

interface ChatInterfaceProps {
    chatHistory: ChatMessage[]
    isLoading: boolean
    setIsModification: React.Dispatch<React.SetStateAction<boolean>>;
    onSendMessage: (message: string) => void
}

export function ChatInterface({ chatHistory, isLoading, onSendMessage, setIsModification }: ChatInterfaceProps) {
    const { inputMessage, setInputMessage, setResponseData, setHistoryResult, setChatHistory } = useAiChatContext()
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [chatHistory])

    const handleSendMessage = () => {
        if (!inputMessage.trim() || isLoading) return
        onSendMessage(inputMessage)
        setInputMessage("")
    }

    return (
        <Card className="md:w-[40%] flex flex-col overflow-hidden shadow-lg">
            <CardHeader className="px-4 py-3 border-b bg-card flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">Trợ lý phân khúc AI</CardTitle>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            className="bg-primary text-white hover:bg-primary/90"
                            onClick={() => {
                                setIsModification(false)
                                setChatHistory([
                                    {
                                        user: "",
                                        ai: "Xin chào! Tôi là trợ lý AI của bạn. Tôi có thể giúp bạn tạo phân khúc khách hàng dựa trên dữ liệu của bạn. Bạn muốn phân khúc khách hàng như thế nào?",
                                    },
                                ])
                                setHistoryResult([])
                                setResponseData(null)
                            }}>
                            <RotateCcw className="w-4 h-4" />
                            Làm mới
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        Làm mới đoạn chat
                    </TooltipContent>
                </Tooltip>
            </CardHeader>

            <CardContent className="p-0 flex-1 overflow-hidden">
                <MessageList messages={chatHistory} isLoading={isLoading} messagesEndRef={messagesEndRef} />
            </CardContent>

            <CardFooter className="p-3 border-t bg-card">
                <MessageInput
                    value={inputMessage}
                    onChange={setInputMessage}
                    onSend={handleSendMessage}
                    isLoading={isLoading}
                />
            </CardFooter>
        </Card>
    )
}
