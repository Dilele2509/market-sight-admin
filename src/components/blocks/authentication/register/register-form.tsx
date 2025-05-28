"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatePresence } from "framer-motion"
import { AccountRegistrationForm } from "./account-registration-form"
import { toast } from "sonner"
import { axiosAuth } from "@/API/axios"

export type FormData = {
  firstName: string
  lastName: string
  email: string
  role: string
  business_id: number
  password: string
  confirmPassword: string
  otpCode: string
}

export type RegistrationStatus = "pending" | "success" | "error"

export function RegisterForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [direction, setDirection] = useState<"left" | "right">("left")
  const [registrationStatus, setRegistrationStatus] = useState<RegistrationStatus>("pending")
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    business_id: null,
    password: "",
    confirmPassword: "",
    otpCode: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleOTPChange = useCallback((value: string) => {
    setFormData((prev) => {
      if (prev.otpCode !== value) {
        return { ...prev, otpCode: value }
      }
      return prev
    })
  }, [])

  const handleNext = () => {
    setDirection("left")
    setStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setDirection("right")
    setStep((prev) => prev - 1)
  }

  const toggleShowPassword = (checked: boolean) => {
    setShowPassword(checked)
  }

  const handleVerifyOTP = () => {
    if (formData.otpCode.length === 6) {
      setRegistrationStatus("success")
    } else {
      setRegistrationStatus("error")
    }
  }

  const handleTryAgain = () => {
    setFormData((prev) => ({ ...prev, otpCode: "" }))
    setRegistrationStatus("pending")
  }

  const resetForm = () => {
    setStep(1)
    setRegistrationStatus("pending")
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      business_id: null,
      password: "",
      confirmPassword: "",
      otpCode: "",
    })
  }

  const getStepDescription = () => {
    if (step === 1) return "Nhập thông tin cá nhân của bạn"
    if (step === 2) return "Tạo mật khẩu an toàn"
    return ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      console.log(formData)
      const res = await axiosAuth.post("/register", formData)
      if (res.status === 200) {
        toast.success("Đăng ký thành công!")
      }
    } catch (error) {
      toast.error("Đăng ký thất bại")
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Đăng ký</CardTitle>
          <CardDescription>{getStepDescription()}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <AccountRegistrationForm
                    direction={direction}
                    formData={formData}
                    onInputChange={handleInputChange}
                    onSelectChange={handleSelectChange}
                    onNext={handleNext}
                    onBack={handleBack}
                    step={1}
                  />
                )}

                {step === 2 && (
                  <AccountRegistrationForm
                    direction={direction}
                    formData={formData}
                    onInputChange={handleInputChange}
                    onSelectChange={handleSelectChange}
                    onNext={handleNext}
                    onBack={handleBack}
                    showPassword={showPassword}
                    onToggleShowPassword={toggleShowPassword}
                    step={2}
                  />
                )}
              </AnimatePresence>
            </div>
            <div className="mt-4 text-center text-sm">
              Đã có tài khoản?{" "}
              <a href="/" className="underline underline-offset-4">
                Đăng nhập
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}