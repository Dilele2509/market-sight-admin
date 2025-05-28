"use client"

import type React from "react"
import { useContext, useEffect, useMemo, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useSyncContext } from "@/context/SyncContext"
import { axiosPrivate } from "@/API/axios"
import AuthContext from "@/context/AuthContext"
import { toast } from "sonner"
import { RequestAuth } from "../SyncData/requestAuthDialog"
import {
    Loader2,
    FileSpreadsheet,
    Link2,
    Users,
    CheckCircle2,
    Database,
    ArrowRight,
    AlertCircle,
    Table,
} from "lucide-react"
import type { CLSList } from "@/types/lifecycleTypes"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ConfigSyncCLSProps {
    open: boolean
    onClose: () => void
    data: CLSList
}

export interface SegmentStats {
    segment: string
    count: number
}

export interface Customer {
    customer_id: string
    first_name: string
    last_name: string
    email: string
    phone: string
    birth_date: string
    gender: string
    address: string
    city: string
    registration_date: string
    first_purchase_date: string
    last_purchase_date: string
    purchase_count: number
    total_spent: number
    avg_purchase_amount: number
    days_between_purchases: number
    days_since_first_purchase: number
    days_since_last_purchase: number
    payment_methods: string
    purchase_categories: string
    categories_purchased: number
    brand_names: string
    brands_purchased: number
    store_names: string
    stores_visited: number
    segment: string
}

export interface SegmentAnalysisResult {
    segment_stats: SegmentStats[]
    customers: Customer[]
}

export const ConfigSyncCLS: React.FC<ConfigSyncCLSProps> = ({ open, onClose, data }) => {
    const [selectedSegments, setSelectedSegments] = useState<string>("")
    const [selectedTarget, setSelectedTarget] = useState<"create" | "use">("create")
    const [sheetValue, setSheetValue] = useState<string>("")
    const { sheetURL } = useSyncContext()
    const { token } = useContext(AuthContext)
    const [dialogOpenNotify, setDialogOpenNotify] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [inputData, setInputData] = useState<SegmentAnalysisResult>()

    const [openPreviewDialog, setOpenPreviewDialog] = useState(false)
    const [previewData, setPreviewData] = useState<any[]>([])
    const [syncRequest, setSyncRequest] = useState<any>(null)
    const [activeTab, setActiveTab] = useState("segment")

    const headerToken = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }

    useEffect(() => {
        if (!data) return

        const segments = Object.keys(data)

        const segment_stats = segments.map((key) => ({
            segment: data[key].name,
            count: data[key].aggregated_metrics?.unique_customers || 0,
        }))

        const customers = segments.flatMap((key) =>
            (data[key].customers || []).map((customer) => ({
                ...customer,
                segment: data[key].name,
            })),
        )

        const finalResult: SegmentAnalysisResult = {
            segment_stats,
            customers,
        }

        console.log("check final format cls data: ", finalResult)
        setInputData(finalResult)
    }, [data])

    const segmentsWithData = useMemo(
        () => inputData?.segment_stats.filter((s) => s.count > 0),
        [inputData?.segment_stats],
    )

    useEffect(() => {
        if (selectedTarget === "use") setSheetValue(sheetURL)
    }, [selectedTarget, sheetURL])

    const handleSegmentChange = (value: string) => {
        setSelectedSegments(value)
    }

    const handleSync = () => {
        const formatSegmentId = (segment: string) => {
            return `segment:${segment.toLowerCase().replace(/\s+/g, "-")}`
        }

        const customerList = inputData?.customers.filter((customer) => customer.segment === selectedSegments)

        if (selectedSegments && sheetValue && customerList?.length) {
            const segmentId = formatSegmentId(selectedSegments)

            const req =
                selectedTarget === "create"
                    ? {
                        segment_id: segmentId,
                        segment_name: selectedSegments,
                        create_new: true,
                        new_file_name: sheetValue,
                    }
                    : {
                        segment_id: segmentId,
                        segment_name: selectedSegments,
                        create_new: false,
                        sheet_url: sheetValue,
                    }

            // Set data for dialog
            setPreviewData(customerList)
            setSyncRequest(req)
            setOpenPreviewDialog(true)
        }
    }

    const startInsertToState = async () => {
        try {
            setIsLoading(true)
            if (syncRequest?.segment_id && previewData.length > 0) {
                const res = await axiosPrivate.post(
                    "/segment/add-state-sync",
                    {
                        segment_id: syncRequest?.segment_id,
                        data: previewData,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                )
                if (res.status === 200) {
                    toast.success("Add to state success: ", res.data?.message)
                    const resTokenCheck = await axiosPrivate.get("/auth/status", headerToken)
                    console.log("check res token: ", resTokenCheck)

                    if (resTokenCheck.data?.data?.is_connected === true) {
                        toast.success("Verification of rights success")
                        //tiếp tục xử lí đồng bộ lên sheet
                        try {
                            const res = await axiosPrivate.post("/sync", syncRequest, headerToken)
                            console.log(res)

                            if (res.data.success === true) {
                                toast.success("Sync success, check your Google Drive now")
                            } else {
                                toast.error("An error occurred during sync. See console for details.")
                                console.error(res.data)
                            }
                        } catch (err) {
                            toast.error("Request failed. Check console for details.")
                            console.error("Sync error:", err)
                        }
                    } else {
                        console.error(resTokenCheck)
                        setDialogOpenNotify(true)
                    }
                } else {
                    console.log(res)
                    toast.error("Error when add data to state")
                }
            }
        } catch (error) {
            console.error(error.message)
        } finally {
            setIsLoading(false)
            setOpenPreviewDialog(false)
            onClose()
        }
    }

    const getSegmentColor = (segment: string) => {
        const colors: Record<string, string> = {
            Champions: "bg-emerald-100 text-emerald-800 border-emerald-200",
            "Loyal Customers": "bg-blue-100 text-blue-800 border-blue-200",
            "Potential Loyalists": "bg-indigo-100 text-indigo-800 border-indigo-200",
            "New Customers": "bg-purple-100 text-purple-800 border-purple-200",
            Promising: "bg-cyan-100 text-cyan-800 border-cyan-200",
            "Needs Attention": "bg-amber-100 text-amber-800 border-amber-200",
            "About To Sleep": "bg-orange-100 text-orange-800 border-orange-200",
            "At Risk": "bg-rose-100 text-rose-800 border-rose-200",
            "Cannot Lose Them": "bg-red-100 text-red-800 border-red-200",
            Hibernating: "bg-gray-100 text-gray-800 border-gray-200",
            Lost: "bg-slate-100 text-slate-800 border-slate-200",
        }

        return colors[segment] || "bg-gray-100 text-gray-800 border-gray-200"
    }

    return (
        <>
            {!openPreviewDialog ? (
                <Dialog open={open} onOpenChange={onClose}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader className="space-y-2">
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                <Database className="h-5 w-5 text-primary" />
                                Đồng bộ dữ liệu RFM
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                Chọn phân khúc và nơi đồng bộ dữ liệu khách hàng của bạn.
                            </DialogDescription>
                        </DialogHeader>

                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-4">
                                <TabsTrigger value="segment" className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    Phân khúc
                                </TabsTrigger>
                                <TabsTrigger value="destination" className="flex items-center gap-2">
                                    <FileSpreadsheet className="h-4 w-4" />
                                    Đích đến
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="segment" className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        Phân khúc đồng bộ
                                    </label>
                                    <Select onValueChange={handleSegmentChange} value={selectedSegments}>
                                        <SelectTrigger className="bg-background border-input">
                                            <SelectValue placeholder="Chọn phân khúc" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-background">
                                            {!segmentsWithData ? (
                                                <div className="flex items-center justify-center py-2">
                                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                    <p>Đang tải phân khúc...</p>
                                                </div>
                                            ) : (
                                                segmentsWithData.map((seg) => (
                                                    <SelectItem key={seg.segment} value={seg.segment}>
                                                        <div className="flex items-center justify-between w-full">
                                                            <span>{seg.segment}</span>
                                                            <Badge variant="outline" className="ml-2">
                                                                {seg.count} khách hàng
                                                            </Badge>
                                                        </div>
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {selectedSegments && (
                                    <Card className="border border-border bg-muted/30">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-medium">Đã chọn phân khúc:</h3>
                                                    <div className="flex items-center mt-1">
                                                        <Badge className={`${getSegmentColor(selectedSegments)} border`}>{selectedSegments}</Badge>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-muted-foreground">Số lượng:</p>
                                                    <p className="font-medium">
                                                        {inputData?.segment_stats.find((s) => s.segment === selectedSegments)?.count || 0} khách
                                                        hàng
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                <div className="pt-2 flex justify-end">
                                    <Button
                                        onClick={() => setActiveTab("destination")}
                                        disabled={!selectedSegments}
                                        className="flex items-center gap-2"
                                    >
                                        Tiếp tục
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TabsContent>

                            <TabsContent value="destination" className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                                        Đồng bộ trên
                                    </label>
                                    <Select
                                        onValueChange={(val: "create" | "use") => {
                                            setSelectedTarget(val)
                                            setSheetValue("")
                                        }}
                                        value={selectedTarget}
                                    >
                                        <SelectTrigger className="bg-background border-input">
                                            <SelectValue placeholder="Chọn nơi đồng bộ" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-background">
                                            <SelectItem value="create" className="flex items-center">
                                                <div className="flex items-center gap-2">
                                                    <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
                                                    <span>Tạo tài liệu Google Sheet mới</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="use" className="flex items-center">
                                                <div className="flex items-center gap-2">
                                                    <Link2 className="h-4 w-4 text-blue-500" />
                                                    <span>Sử dụng Google Sheet sẵn có</span>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <div className="pt-2">
                                        <Input
                                            placeholder={
                                                selectedTarget === "create"
                                                    ? "Nhập tên Google Sheet mới"
                                                    : "Nhập đường dẫn tài liệu trang tính của bạn"
                                            }
                                            className="bg-background border-input"
                                            value={sheetValue}
                                            onChange={(e) => setSheetValue(e.target.value)}
                                        />
                                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {selectedTarget === "create"
                                                ? "Tệp mới sẽ được tạo trong Google Drive của bạn"
                                                : "Đảm bảo bạn đã cấp quyền truy cập cho ứng dụng"}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-between">
                                    <Button variant="outline" onClick={() => setActiveTab("segment")} className="flex items-center gap-2">
                                        Quay lại
                                    </Button>
                                    <Button
                                        onClick={handleSync}
                                        disabled={selectedSegments.trim() === "" || sheetValue.trim() === ""}
                                        className="flex items-center gap-2"
                                    >
                                        <CheckCircle2 className="h-4 w-4" />
                                        Đồng bộ
                                    </Button>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </DialogContent>
                </Dialog>
            ) : !dialogOpenNotify ? (
                <Dialog open={openPreviewDialog} onOpenChange={setOpenPreviewDialog}>
                    <DialogContent className="max-w-5xl">
                        <DialogHeader className="space-y-2">
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                <Table className="h-5 w-5 text-primary" />
                                Xác nhận đồng bộ khách hàng
                            </DialogTitle>
                            <DialogDescription>Xem trước dữ liệu sẽ được đồng bộ lên Google Sheet</DialogDescription>
                        </DialogHeader>

                        <div className="bg-muted/30 p-3 rounded-md border border-border mb-4">
                            <div className="flex flex-wrap gap-4 justify-between">
                                <div>
                                    <p className="text-sm font-medium">Phân khúc:</p>
                                    <Badge className={`mt-1 ${getSegmentColor(selectedSegments)} border`}>{selectedSegments}</Badge>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Số lượng khách hàng:</p>
                                    <p className="font-medium mt-1">{previewData.length}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Đích đến:</p>
                                    <p className="text-sm mt-1 flex items-center gap-1">
                                        {selectedTarget === "create" ? (
                                            <>
                                                <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
                                                <span className="font-medium">{sheetValue}</span>
                                            </>
                                        ) : (
                                            <>
                                                <Link2 className="h-4 w-4 text-blue-500" />
                                                <span className="font-medium truncate max-w-[200px]">{sheetValue}</span>
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="border border-border rounded-md overflow-hidden">
                            <ScrollArea className="h-[350px] w-full">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted sticky top-0">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-medium">Customer ID</th>
                                            <th className="px-4 py-3 text-left font-medium">First Name</th>
                                            <th className="px-4 py-3 text-left font-medium">Last Name</th>
                                            <th className="px-4 py-3 text-left font-medium">Total Spent</th>
                                            <th className="px-4 py-3 text-left font-medium">Segment</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {previewData.map((row, index) => (
                                            <tr key={index} className="hover:bg-muted/50">
                                                <td className="px-4 py-3">{row.customer_id}</td>
                                                <td className="px-4 py-3">{row.first_name}</td>
                                                <td className="px-4 py-3">{row.last_name}</td>
                                                <td className="px-4 py-3">{row.total_spent.toLocaleString()}</td>
                                                <td className="px-4 py-3">
                                                    <Badge className={`${getSegmentColor(row.segment)} border`}>{row.segment}</Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </ScrollArea>
                        </div>

                        <DialogFooter className="mt-4">
                            <Button variant="outline" onClick={() => setOpenPreviewDialog(false)} className="gap-2">
                                Hủy
                            </Button>
                            <Button disabled={isLoading} onClick={startInsertToState} className="gap-2">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Đang đồng bộ...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="h-4 w-4" />
                                        Xác nhận đồng bộ
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            ) : (
                <RequestAuth
                    open={dialogOpenNotify}
                    onClose={() => {
                        setDialogOpenNotify(false)
                    }}
                />
            )}
        </>
    )
}
