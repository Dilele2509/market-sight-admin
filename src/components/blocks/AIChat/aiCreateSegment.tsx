"use client"

import type * as React from "react"
import { useState, useEffect } from "react"
import { Check, ChevronRight, Copy, Layers } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAiChatContext } from "@/context/AiChatContext"
import { toast } from "sonner"

interface CreateAISegmentationProps {
    open: boolean
    onClose: () => void
    onCreateSegment?: (data: { name: string; description: string }) => void
}

export function CreateAISegmentation({ open, onClose, onCreateSegment }: CreateAISegmentationProps) {
    const { segmentId, segmentName, description } = useAiChatContext()
    const [copySuccess, setCopySuccess] = useState(false)
    const [step, setStep] = useState<1 | 2>(1)
    const [formData, setFormData] = useState({
        name: segmentName ?? "",
        segment_id: segmentId ?? "",
        description: description ?? "",
    })

    const handleCopySegmentId = () => {
        navigator.clipboard.writeText(segmentId)
            .then(() => {
                setCopySuccess(true);
                toast.success('Segment ID copied to clipboard');

                setTimeout(() => {
                    setCopySuccess(false);
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                toast.error('Failed to copy to clipboard');
            });
    };

    const handleNext = () => {
        setStep(2)
    }

    const handleBack = () => {
        setStep(1)
    }

    const handleCreate = () => {
        if (onCreateSegment) {
            onCreateSegment(formData)
        }
        resetAndClose()
    }

    const resetAndClose = () => {
        setStep(1)
        setFormData({ name: "", segment_id: "", description: "" })
        onClose()
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        if (name === 'name') {
            const slug = value
                .toLowerCase()
                .replace(/[^\w\s-]/g, "")
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-");
            setFormData((prev) => ({ ...prev, ['segment_id']: `segment:${slug}` }))
        }
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    return (
        <Dialog open={open} onOpenChange={(open) => !open && resetAndClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center justify-between mb-2 mt-4">
                        <DialogTitle className="text-xl font-semibold">
                            {step === 1 ? "Xác nhận tạo phân khúc" : "Thông tin phân khúc"}
                        </DialogTitle>
                        <div className="flex items-center">
                            <div
                                className={`flex items-center justify-center w-6 h-6 rounded-full ${step >= 1 ? "bg-primary text-card" : "bg-secondary text-card-foreground"
                                    }`}
                            >
                                1
                            </div>
                            <div className={`w-6 h-0.5 ${step >= 2 ? "bg-primary" : "bg-secondary"}`} />
                            <div
                                className={`flex items-center justify-center w-6 h-6 rounded-full ${step >= 2 ? "bg-primary text-card" : "bg-secondary text-card-foreground"
                                    }`}
                            >
                                2
                            </div>
                        </div>
                    </div>
                    <DialogDescription>
                        {step === 1
                            ? "Xác nhận tạo phân khúc mới dựa trên kết quả AI đã hỗ trợ"
                            : "Nhập thông tin chi tiết cho phân khúc mới của bạn."}
                    </DialogDescription>
                </DialogHeader>

                {step === 1 ? (
                    <div className="flex flex-col items-center py-6 space-y-6">
                        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
                            <Layers className="w-10 h-10 text-primary" />
                        </div>
                        <div className="text-center space-y-2">
                            <p className="text-sm text-card-foreground max-w-sm">
                                Kết quả được tạo bởi sự phân tích của AI có thể sẽ không hoàn toàn chính xác. Bạn có thể thoát để xem lại kết quả và chỉnh sửa đúng theo yêu cầu của mình trước khi xác nhận
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">
                                Tên phân khúc <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Nhập tên phân khúc"
                                className="w-full"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="font-medium">ID phân khúc</label>
                            <div className="relative">
                                <Input id="segment_id" name="segment_id" value={formData.segment_id} readOnly className="bg-background cursor-default" />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                    onClick={handleCopySegmentId}
                                >
                                    {copySuccess ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-medium">
                                Mô tả
                            </Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Mô tả ngắn gọn về phân khúc này (tùy chọn)"
                                className="w-full min-h-[100px]"
                            />
                        </div>
                    </div>
                )}

                <DialogFooter className="flex justify-between sm:justify-between">
                    {step === 1 ? (
                        <>
                            <Button className="text-card-foreground" variant="outline" onClick={resetAndClose}>
                                Hủy
                            </Button>
                            <Button className="text-card" onClick={handleNext}>
                                Tiếp tục
                                <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button className="text-card-foreground" variant="outline" onClick={handleBack}>
                                Quay lại
                            </Button>
                            <Button className="text-card" onClick={handleCreate} disabled={!formData.name.trim()}>
                                <Check className="mr-1 h-4 w-4" />
                                Tạo phân khúc
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}