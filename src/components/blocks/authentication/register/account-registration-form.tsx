"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import type { FormData } from "./register-form"
import { useContext, useEffect, useState } from "react"
import { axiosPrivate } from "@/API/axios"
import { error } from "console"
import { toast } from "sonner"
import { BusinessGuideModal } from "./BusinessGuideModal"

type AccountRegistrationFormProps = {
    direction: "left" | "right"
    formData: FormData
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onSelectChange: (name: string, value: string) => void
    onNext: () => void
    onBack: () => void
    step: number
    showPassword?: boolean
    onToggleShowPassword?: (checked: boolean) => void
}

export function AccountRegistrationForm({
    direction,
    formData,
    onInputChange,
    onSelectChange,
    onNext,
    onBack,
    step,
    showPassword = false,
    onToggleShowPassword,
}: AccountRegistrationFormProps) {
    const [businessList, setBusinessList] = useState<any[]>([])

    const fetchBusinessList = async () => {
        try {
            await axiosPrivate.get('/businesses')
                .then((res) => {
                    if (res.status === 200) {
                        setBusinessList(res.data)
                    };
                })
                .catch((err) => {
                    toast.error(err.message)
                })
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchBusinessList();
    }, [])

    if (step === 1) {
        return (
            <motion.div
                key="step1"
                initial={{ opacity: 0, x: direction === "left" ? 400 : -400 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction === "left" ? -400 : 400 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
            >
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                            id="firstName"
                            type="text"
                            value={formData.firstName}
                            onChange={onInputChange}
                            placeholder="John"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                            id="lastName"
                            type="text"
                            value={formData.lastName}
                            onChange={onInputChange}
                            placeholder="Doe"
                            required
                        />
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={onInputChange}
                        placeholder="m@example.com"
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <Label>Role</Label>
                    <RadioGroup onValueChange={(value) => onSelectChange("role", value)} value={formData.role}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="3" id="marketing" />
                            <Label className="font-normal" htmlFor="marketing">Marketing Team</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="2" id="data" />
                            <Label className="font-normal" htmlFor="data">Data Team</Label>
                        </div>
                    </RadioGroup>
                </div>
                <div className="grid gap-2">
                    <Label>Select Business</Label>
                    <Select
                        onValueChange={(value) => onSelectChange("business_id", value)} 
                        value={String(formData.business_id)} 
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a business">
                                {businessList.find((b) => b.business_id === Number(formData.business_id))?.name || "Select a business"}
                            </SelectValue>
                        </SelectTrigger>
                        {Array.isArray(businessList) && businessList.length > 0 && (
                            <SelectContent className="bg-card">
                                {businessList.map((business) => (
                                    <SelectItem
                                        key={business.business_id}
                                        className="hover:bg-background hover:cursor-pointer"
                                        value={String(business.business_id)} 
                                    >
                                        {business.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        )}
                    </Select>
                    {/* Custom helper text below Select */}
                    <p className="text-sm text-muted-foreground">
                        Can not find your business? <BusinessGuideModal />
                    </p>
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

    return (
        <motion.div
            key="step2"
            initial={{ opacity: 0, x: direction === "left" ? 400 : -400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction === "left" ? -400 : 400 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6"
        >
            <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={onInputChange}
                    required
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={onInputChange}
                    required
                />
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="showPassword"
                        checked={showPassword}
                        onCheckedChange={(checked) => onToggleShowPassword?.(checked as boolean)}
                    />
                    <label
                        htmlFor="showPassword"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Show password
                    </label>
                </div>
            </div>
            <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onBack} className="w-full">
                    Back
                </Button>
                <Button type="submit" className="w-full">
                    Register
                </Button>
            </div>
        </motion.div>
    )
}
