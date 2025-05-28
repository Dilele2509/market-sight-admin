"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { Input } from "@/components/ui/input"

interface OTPInputProps {
    length?: number
    value: string
    onChange: (value: string) => void
}

export function OTPInput({ length = 6, value, onChange }: OTPInputProps) {
    const [otp, setOtp] = useState<string[]>(value.split("").concat(Array(length - value.length).fill("")))
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])
    const isInitialMount = useRef(true)

    // Initialize refs array
    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, length)
    }, [length])

    // Update parent component when OTP changes, but only after initial mount
    // and only if the value actually changed
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false
            return
        }

        const otpValue = otp.join("")
        if (otpValue !== value) {
            onChange(otpValue)
        }
    }, [otp, onChange, value])

    // Update internal state when value prop changes, but only if it's different
    // from the current internal state to avoid infinite loops
    useEffect(() => {
        const currentOtpValue = otp.join("")
        if (value !== currentOtpValue) {
            const newOtp = value.split("").concat(Array(length - value.length).fill(""))
            setOtp(newOtp)
        }
    }, [value, length, otp])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newValue = e.target.value

        // Only accept single digits
        if (!/^\d*$/.test(newValue)) return

        // Handle paste
        if (newValue.length > 1) {
            const pastedValue = newValue.split("")
            const newOtp = [...otp]

            // Fill current and subsequent inputs
            for (let i = 0; i < length; i++) {
                if (index + i < length && i < pastedValue.length) {
                    newOtp[index + i] = pastedValue[i]
                }
            }

            setOtp(newOtp)

            // Focus on the next empty input or the last input
            const nextIndex = Math.min(index + pastedValue.length, length - 1)
            inputRefs.current[nextIndex]?.focus()
            return
        }

        // Handle single digit input
        const newOtp = [...otp]
        newOtp[index] = newValue
        setOtp(newOtp)

        // Auto-focus next input if a digit was entered
        if (newValue && index < length - 1) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        // Handle backspace
        if (e.key === "Backspace") {
            if (otp[index]) {
                // Clear current input if it has a value
                const newOtp = [...otp]
                newOtp[index] = ""
                setOtp(newOtp)
            } else if (index > 0) {
                // Move to previous input if current is empty
                inputRefs.current[index - 1]?.focus()
            }
        }

        // Handle left arrow key
        if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }

        // Handle right arrow key
        if (e.key === "ArrowRight" && index < length - 1) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select()
    }

    return (
        <div className="flex justify-center gap-2">
            {Array.from({ length }, (_, index) => (
                <Input
                    key={index}
                    ref={(el) => {inputRefs.current[index] = el}}
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength={1}
                    value={otp[index] || ""}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onFocus={handleFocus}
                    className="w-12 h-12 text-center text-xl p-0"
                    aria-label={`Digit ${index + 1}`}
                />
            ))}
        </div>
    )
}
