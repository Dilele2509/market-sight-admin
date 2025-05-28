"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, XCircle } from "lucide-react"
import { OTPInput } from "./otp-input-simple"
import type { FormData, RegistrationStatus } from "./register-form"

type BusinessRegistrationFormProps = {
    direction: "left" | "right"
    formData: FormData
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onSelectChange: (name: string, value: string) => void
    onNext: () => void
    onBack: () => void
    step: number
    registrationStatus: RegistrationStatus
    onVerifyOTP: () => void
    onReset: () => void
    onTryAgain: () => void
    onOTPChange: (value: string) => void
}

// Updated list of business areas
const businessIndustry = [
    "E-commerce",
    "Retail",
    "Technology",
    "Fashion",
    "Grocery",
    "Food & Beverage",
    "Healthcare",
    "Education",
    "Real Estate",
    "Finance",
    "Travel & Hospitality",
    "Transportation & Logistics",
    "Automotive",
    "Manufacturing",
    "Construction",
    "Entertainment",
    "Media & Publishing",
    "Telecommunications",
    "Energy & Utilities",
    "Agriculture",
    "Beauty & Personal Care",
    "Home & Living",
    "Sports & Recreation",
    "Legal Services",
    "Marketing & Advertising",
    "Nonprofit & Charity",
    "Pet Services",
    "Consulting",
    "Event Planning",
    "Software as a Service (SaaS)"
]

export function BusinessRegistrationForm({
    direction,
    formData,
    onInputChange,
    onSelectChange,
    onNext,
    onBack,
    step,
    registrationStatus,
    onVerifyOTP,
    onReset,
    onTryAgain,
    onOTPChange,
}: BusinessRegistrationFormProps) {
    if (step === 1) {
        return (
            <motion.div
                key="business-step1"
                initial={{ opacity: 0, x: direction === "left" ? 400 : -400 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction === "left" ? -400 : 400 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
            >
                <div className="grid gap-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                        id="businessName"
                        type="text"
                        placeholder="Acme Inc."
                        value={formData.businessName}
                        onChange={onInputChange}
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="businessEmail">Business Email</Label>
                    <Input
                        id="businessEmail"
                        type="email"
                        placeholder="contact@acme.com"
                        value={formData.businessEmail}
                        onChange={onInputChange}
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="businessPhone">Phone Number</Label>
                    <Input
                        id="businessPhone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={formData.businessPhone}
                        onChange={onInputChange}
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <Label>Business Area</Label>
                    <Select onValueChange={(value) => onSelectChange("industry", value)} value={formData.industry}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select your business area" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px] bg-card">
                            {businessIndustry.map((area) => (
                                <SelectItem className="hover:cursor-pointer hover:bg-background" key={area} value={area.toLowerCase()}>
                                    {area}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={onBack} className="w-full">
                        Back
                    </Button>
                    <Button type="button" onClick={onNext} className="w-full">
                        Next
                    </Button>
                </div>
            </motion.div>
        )
    }

    if (step === 2 && registrationStatus === "pending") {
        return (
            <motion.div
                key="business-step2"
                initial={{ opacity: 0, x: direction === "left" ? 400 : -400 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction === "left" ? -400 : 400 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
            >
                <div className="text-center mb-2">
                    <p className="text-sm text-muted-foreground">
                        We've sent a verification code to <strong>{formData.businessEmail}</strong>
                    </p>
                </div>
                <div className="grid gap-4">
                    <Label htmlFor="otpCode" className="text-center">
                        Verification Code
                    </Label>
                    <OTPInput value={formData.otpCode} onChange={onOTPChange} />
                    <p className="text-xs text-muted-foreground mt-1 text-center">
                        Enter the 6-digit code we sent to verify your business email
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={onBack} className="w-full">
                        Back
                    </Button>
                    <Button type="button" onClick={onVerifyOTP} className="w-full" disabled={formData.otpCode.length !== 6}>
                        Verify
                    </Button>
                </div>
            </motion.div>
        )
    }

    // Registration result (success or error)
    return (
        <motion.div
            key="business-result"
            initial={{ opacity: 0, x: direction === "left" ? 400 : -400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction === "left" ? -400 : 400 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6 items-center text-center py-6"
        >
            {registrationStatus === "success" ? (
                <>
                    <CheckCircle2 className="h-16 w-16 text-green-500" />
                    <div>
                        <h3 className="text-xl font-semibold mb-2">Registration Successful!</h3>
                        <p className="text-muted-foreground">
                            Your business account has been created successfully. You can now sign in to access your dashboard.
                        </p>
                    </div>
                </>
            ) : (
                <>
                    <XCircle className="h-16 w-16 text-red-500" />
                    <div>
                        <h3 className="text-xl font-semibold mb-2">Verification Failed</h3>
                        <p className="text-muted-foreground">
                            We couldn't verify your business email. Please check the code and try again.
                        </p>
                    </div>
                    <Button type="button" variant="outline" onClick={onTryAgain} className="mt-2">
                        Try Again
                    </Button>
                </>
            )}
            <Button type="button" onClick={onReset} className="mt-2">
                Back to Sign In
            </Button>
        </motion.div>
    )
}
