"use client"

import type React from "react"

import { useNavigate } from "react-router-dom"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LockKeyhole, CheckCircle, XCircle, Shield } from "lucide-react"

interface RequestAuthProps {
    open: boolean
    onClose: () => void
}

export const RequestAuth: React.FC<RequestAuthProps> = ({ open, onClose }) => {
    const navigate = useNavigate()

    const handleGrantPermission = () => {
        navigate("/sync-config")
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="sm:max-w-md border-0 shadow-lg">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground p-3 rounded-full shadow-md">
                    <LockKeyhole className="h-6 w-6" />
                </div>

                <DialogHeader className="pt-6 pb-2">
                    <DialogTitle className="text-xl font-bold text-center">Yêu cầu cấp quyền Google Sheet</DialogTitle>
                    <DialogDescription className="text-center text-muted-foreground pt-2">
                        Để tiếp tục sử dụng tính năng đồng bộ
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center space-y-4 py-4">
                    <div className="bg-muted/50 p-4 rounded-lg border border-border w-full">
                        <div className="flex items-center gap-3">
                            <Shield className="h-6 w-6 min-w-7 text-primary" />
                            <div>
                                <p className="text-sm text-foreground font-medium mb-1">Thông báo quyền truy cập</p>
                                <p className="text-sm text-muted-foreground text-justify">
                                    Bạn chưa cấp quyền truy cập Google Sheet. Bạn có muốn cấp quyền để đồng bộ dữ liệu không?
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full text-sm">
                        <div className="flex items-center gap-2 p-3 rounded-md bg-muted/30">
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                            <span>Đồng bộ dữ liệu</span>
                        </div>
                        <div className="flex items-center gap-2 p-3 rounded-md bg-muted/30">
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                            <span>Truy cập an toàn</span>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-3 pt-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="hover:bg-red-600 sm:flex-1 gap-2 border-2 hover:text-destructive hover:border-destructive/30"
                    >
                        <XCircle className="h-4 w-4" />
                        Thoát
                    </Button>
                    <Button
                        onClick={handleGrantPermission}
                        className="sm:flex-1 gap-2 bg-primary hover:bg-primary-dark transition-colors"
                    >
                        <CheckCircle className="h-4 w-4" />
                        Tiến hành cấp quyền
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
