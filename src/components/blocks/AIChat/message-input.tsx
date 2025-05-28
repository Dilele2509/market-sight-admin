"use client"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Send, Loader2 } from "lucide-react"
import { useRef } from "react"

interface MessageInputProps {
    value: string
    onChange: (value: string) => void
    onSend: () => void
    isLoading: boolean
}

export function MessageInput({ value, onChange, onSend, isLoading }: MessageInputProps) {
    const buttonRef = useRef<HTMLButtonElement>(null)
    return (
        <div className="relative w-full">
            <Textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Nhập tin nhắn của bạn..."
                className="min-h-[60px] pr-14 resize-none rounded-xl"
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        buttonRef.current?.click()
                    }
                }}
            />
            <Button
                className="absolute right-2.5 bottom-2.5 h-9 w-9 p-0 rounded-full"
                ref={buttonRef}
                onClick={onSend}
                disabled={isLoading || !value.trim()}
            >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
        </div>
    )
}
