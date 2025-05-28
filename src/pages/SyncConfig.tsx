"use client"

import { useContext, useEffect, useState } from "react"
import { useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { InfoIcon, CheckCircle, AlertCircle, ExternalLink, Loader2 } from "lucide-react"
import { useSyncContext } from "@/context/SyncContext"
import { DashboardShell } from "@/components/layout/DashboardShell"
import { axiosPrivate } from "@/API/axios"
import { headers } from "next/headers"
import AuthContext from "@/context/AuthContext"
import { toast } from "sonner"
import { error } from "console"

export default function SyncConfigPage() {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [step, setStep] = useState<number>(1)
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const { sheetURL, setSheetURL } = useSyncContext()
    const [showPreview, setShowPreview] = useState<boolean>(false)
    const [embedUrl, setEmbedUrl] = useState<string>("")
    const { token } = useContext(AuthContext)
    const [authURL, setAuthURL] = useState<string>('')
    const [isAuthorization, setIsAuthorization] = useState(false)

    const headerToken = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const checkAuthAvailable = async () => {
        const res = await axiosPrivate.get('/auth/status', headerToken)
        if (res.data?.data?.is_connected) setIsAuthorization(!isAuthorization)
    }

    useEffect(() => {
        checkAuthAvailable()
    }, [])

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const success = query.get('success');
        const dataEncoded = query.get('data');

        if (success === 'true' && dataEncoded) {
            checkAuthAvailable()
            const decoded = JSON.parse(atob(dataEncoded));
            //console.log('OAuth success data:', decoded);
            toast.success('Cấp quyền truy cập thành công')
            setShowDialog(false)
        } else if(isAuthorization) {
            const sheetURL = localStorage.getItem("sheetURL")
            if (sheetURL) {
                localStorage.removeItem("sheetURL")
            }

            toast.error("Cấp quyền truy cập thất bại")
        }
    }, []);

    const handleInitialize = async () => {
        setIsLoading(!isLoading)
        await axiosPrivate.get('/auth/google', headerToken)
            .then((res) => {
                if (res.data.success) {
                    setAuthURL(res.data?.data?.authUrl)
                    toast.success('Khởi tạo thành công')
                    setTimeout(() => {
                        setShowDialog(true)
                    }, 500)
                } else {
                    console.error(res.data?.error);
                    toast.error(`Lỗi khi khởi tạo quyền truy cập: ${res.data?.error}`)
                }
            })
            .catch((error) => {
                console.error(error);
                toast.error(`Lỗi khi khởi tạo quyền truy cập: ${error}`)
            })
            .finally(() => {
                setIsLoading(!isLoading)
            })
    }

    const handleImportSheet = () => {
        if (!sheetURL) return

        if (!sheetURL.includes("docs.google.com/spreadsheets")) {
            alert("Please enter a valid Google Sheets URL")
            return
        }

        let url = sheetURL

        if (url.includes("/edit")) {
            url = url.replace("/edit", "/preview")

            if (url.includes("?")) {
                url = url + "&embedded=true"
            } else {
                url = url + "?embedded=true"
            }
        } else if (!url.includes("embedded=true")) {
            if (url.includes("?")) {
                url = url + "&embedded=true"
            } else {
                url = url + "?embedded=true"
            }
        }
        const storedURL = localStorage.getItem('sheetURL');
        if (storedURL !== url) {
            setSheetURL(url);
            localStorage.setItem('sheetURL', url);
        }
        setEmbedUrl(url)
        setShowPreview(true)
    }

    return (
        <DashboardShell>
            <div className="container py-10">
                <h1 className="text-3xl font-bold mb-6">Cấu hình đồng bộ dữ liệu</h1>

                {!isAuthorization ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Bước 1: Khởi tạo Quyền truy cập</CardTitle>
                            <CardDescription>
                                Trước khi bạn có thể đồng bộ hóa dữ liệu, chúng tôi cần khởi tạo quyền truy cập vào tài khoản Google của bạn.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Alert>
                                <InfoIcon className="h-4 w-4" />
                                <AlertTitle>Lưu ý quan trọng</AlertTitle>
                                <AlertDescription>
                                    Nhấp vào nút bên dưới để bắt đầu quá trình khởi tạo. Điều này là bắt buộc trước khi bạn có thể nhập Google Trang tính của mình.
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                        <CardFooter>
                            <Button
                                disabled={isLoading}
                                onClick={handleInitialize}
                                className="text-card-foreground flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Đang khởi tạo...
                                    </>
                                ) : (
                                    "Khởi tạo"
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>Bước 2: Nhập Google Trang tính</CardTitle>
                            <CardDescription>
                                Nhập liên kết đến Google Sheet của bạn. Đảm bảo bạn đã mở quyền chỉnh sửa trên trang tính trước khi nhập.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Trước khi bạn tiến hành</AlertTitle>
                                <AlertDescription>
                                    Hãy đảm bảo bạn đã thiết lập quyền chia sẻ phù hợp trên Google Sheet của mình. Trang tính phải được thiết lập thành &quot;
                                    Bất kỳ ai có liên kết đều có thể xem&quot; hoặc &quot;
                                    Bất kỳ ai có liên kết đều có thể chỉnh sửa&quot; để có kết quả tốt nhất.
                                </AlertDescription>
                            </Alert>

                            <div className="space-y-2">
                                <label htmlFor="sheet-link" className="text-sm font-medium">
                                    Liên kết Google Trang tính
                                </label>
                                <div className="flex gap-2">
                                    <Input
                                        id="sheet-link"
                                        placeholder="https://docs.google.com/spreadsheets/d/..."
                                        value={sheetURL}
                                        onChange={(e) => {
                                            console.log("Updating sheet URL to:", e.target.value)
                                            setSheetURL(e.target.value)
                                        }}
                                    />
                                    <Button onClick={handleImportSheet}>Import</Button>
                                </div>
                                <div className="mt-2">
                                    <p className="text-xs text-gray-500">URL hiện tại: {sheetURL || "Không có URL nào được đặt"}</p>
                                </div>
                            </div>

                            {showPreview && (
                                <div className="mt-6 space-y-4">
                                    <div className="flex items-center gap-2 text-green-600">
                                        <CheckCircle className="h-5 w-5" />
                                        <span className="font-medium">Đã kết nối thành công!</span>
                                    </div>

                                    <div className="border rounded-md p-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="font-medium">Trang tính Google</h3>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex items-center gap-1"
                                                onClick={() => window.open(sheetURL, "_blank")}
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                                <span>Mở trong Google Trang tính</span>
                                            </Button>
                                        </div>

                                        <div className="border rounded overflow-hidden">
                                            {embedUrl ? (
                                                <iframe src={embedUrl} className="w-full h-[500px]" title="Google Sheet" frameBorder="0" />
                                            ) : (
                                                <div className="h-[500px] flex items-center justify-center bg-slate-50">
                                                    <p className="text-slate-500">Không thể tải bản xem trước trang tính</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Access Rights Dialog */}
                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Khởi tạo thành công</DialogTitle>
                            <DialogDescription>
                                Quá trình khởi tạo đã thành công. Bây giờ chúng tôi cần sự cho phép của bạn để có thể truy cập Google Drive của bạn.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-4">
                            <Alert className="mb-4">
                                <InfoIcon className="h-4 w-4" />
                                <AlertTitle>Lưu ý quan trọng</AlertTitle>
                                <AlertDescription>
                                    Nhấp vào nút bên dưới sẽ cho phép ứng dụng truy cập Google Drive theo email đăng nhập của bạn.
                                    Điều này là cần thiết để khởi tạo và đồng bộ hóa với bảng tính của bạn.
                                </AlertDescription>
                            </Alert>
                        </div>

                        <DialogFooter>
                            <Button className="bg-red-600 text-card-foreground p-0 hover:bg-red-800">
                                <a href={authURL} className="h-full flex items-center p-2 rounded-md">Cho phép truy cập</a>
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardShell>
    )
}
