"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, Code, Database, FilePlus2 } from "lucide-react"
import { SqlEditor } from "./sql-editor"
import { ModelEditor } from "./model-editor"
import { LoadingCircles } from "./loading-circles"
import { DataTable } from "./data-table"
import { ResponseData } from "@/types/aichat"
import { Button } from "@/components/ui/button"
import { Dialog } from "@radix-ui/react-dialog"
import { useContext, useEffect, useState } from "react"
import { CreateAISegmentation } from "./aiCreateSegment"
import { useAiChatContext } from "@/context/AiChatContext"
import AuthContext from "@/context/AuthContext"
import { axiosPrivate } from "@/API/axios"
import { toast } from "sonner"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { generateSQLPreview } from "@/utils/segmentFunctionHelper"

interface PreviewPanelProps {
    activeTab: string
    setActiveTab: (tab: string) => void
    isLoading: boolean
    responseData: ResponseData
}

export function PreviewPanel({
    activeTab,
    setActiveTab,
    isLoading,
    responseData,
}: PreviewPanelProps) {
    const [isOpenDialog, setIsOpenDialog] = useState(false)
    const { conditions, conditionGroups, rootOperator, selectedDataset, setConditionGroups, setConditions, setRootOperator, historyResult, setDisplayData, setSqlQuery } = useAiChatContext()
    const { token, user } = useContext(AuthContext)
    const [selectedVersion, setSelectedVersion] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (historyResult.length > 0) {
            const latest = historyResult[historyResult.length - 1]?.version;
            if (latest) setSelectedVersion(latest);
        }
    }, [historyResult]);

    useEffect(() => {
        if (selectedVersion) {
            handleSelect(selectedVersion);
        }
    }, [selectedVersion]);

    const handleSelect = (value: string) => {
        if (!value) return;
        const matched = historyResult.find((item) => item.version === value);
        if (matched) {
            setDisplayData(matched.result)
        }
    };


    const handleSaveSegment = async (data: { name: string; segment_id: string, description: string }) => {
        try {
            console.log("Created segment:", data)

            const segment = {
                segment_id: data?.segment_id,
                segment_name: data?.name,
                created_by_user_id: user.user_id,
                dataset: selectedDataset.name,
                description: data?.description,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                status: 'active',
                filter_criteria: {
                    conditions: conditions,
                    conditionGroups: conditionGroups,
                    rootOperator: rootOperator
                }
            };

            console.log('[SegmentBuilder] Sending segment to API:', segment);

            await axiosPrivate.post('/segment/save-segment', segment, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }).then(() => {
                toast.success(`Phân khúc đã được tạo thành công`);
                setConditionGroups([]);
                setConditions([])
                setRootOperator("AND")

            }).catch((err) => {
                toast.error('Failed to save segment: ', err);
            });

        } catch (error) {
            console.error('Lỗi khi lưu phân khúc', error);
            toast.error('Không lưu được phân khúc. Vui lòng thử lại.');
        }
    };

    return (
        <Card className="w-full md:w-[60%] flex flex-col overflow-hidden shadow-lg">
            <Tabs defaultValue="preview" value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
                <CardHeader className="px-4 py-3 border-b bg-card">
                    <TabsList className="grid grid-cols-3 h-10 rounded-lg">
                        <TabsTrigger disabled={isLoading} value="sql" className="rounded-md">
                            <div className="flex items-center gap-2 py-0.5">
                                <Code className="h-4 w-4" />
                                <span className="text-sm font-medium">Chỉnh sửa SQL</span>
                            </div>
                        </TabsTrigger>
                        <TabsTrigger disabled={isLoading || Object.entries(responseData || {}).length === 0} value="model" className="rounded-md">
                            <div className="flex items-center gap-2 py-0.5">
                                <Database className="h-4 w-4" />
                                <span className="text-sm font-medium">Chỉnh sửa mô hình</span>
                            </div>
                        </TabsTrigger>
                        <TabsTrigger disabled={isLoading || Object.entries(responseData || {}).length === 0} value="preview" className="rounded-md">
                            <div className="flex items-center gap-2 py-0.5">
                                <Table className="h-4 w-4" />
                                <span className="text-sm font-medium">Xem trước</span>
                            </div>
                        </TabsTrigger>
                    </TabsList>
                </CardHeader>

                <div className="flex items-center mt-4 mr-6 justify-between">
                    {Object.entries(responseData ?? {}).length > 0 &&
                        <>
                            <div className="flex items-center gap-2 ml-6 min-w-fit">
                                <label className="text-sm text-card-foreground font-semibold min-w-fit">Kết quả đang hiển thị: </label>
                                <Select value={selectedVersion} onValueChange={setSelectedVersion}>
                                    <SelectTrigger className="max-w-[200px] bg-background">
                                        <SelectValue placeholder="Chọn kết quả hiển thị" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background">
                                        {historyResult.map((item, index) => (
                                            <SelectItem className="bg-background hover:bg-secondary" key={index} value={item.version}>
                                                {item.version}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div >
                            <Button onClick={() => setIsOpenDialog(true)}>
                                <FilePlus2 className="text-card" />
                                <p className="text-card">Tạo phân khúc</p>
                            </Button>
                        </>}
                </div>

                <CardContent className="p-0 flex-1 overflow-hidden">
                    <TabsContent
                        value="sql"
                        className="flex-1 p-5 m-0 h-full data-[state=active]:flex data-[state=active]:flex-col"
                    >
                        <CardTitle className="text-lg font-semibold mb-4">Trình soạn thảo SQL</CardTitle>
                        <SqlEditor isLoading={isLoading} />
                    </TabsContent>

                    <TabsContent
                        value="model"
                        className="flex-1 p-5 m-0 h-full data-[state=active]:flex data-[state=active]:flex-col"
                    >
                        <CardTitle className="text-lg font-semibold mb-4">Trình soạn thảo mô hình</CardTitle>
                        <ModelEditor />
                    </TabsContent>

                    <TabsContent
                        value="preview"
                        className="flex-1 overflow-auto p-5 m-0 h-full data-[state=active]:flex data-[state=active]:flex-col"
                    >
                        <CardTitle className="text-lg font-semibold mb-4">Xem trước dữ liệu</CardTitle>
                        {isLoading ? (
                            <div className="h-[calc(100%-2rem)] flex flex-col items-center justify-center">
                                <LoadingCircles />
                                <p className="mt-5 text-sm font-medium">Đang tạo dữ liệu phân khúc...</p>
                                <p className="text-xs text-muted-foreground mt-1">Quá trình này có thể mất vài giây</p>
                            </div>
                        ) : responseData ? (
                            <DataTable />
                        ) : (
                            <div className="h-[calc(100%-2rem)] flex flex-col items-center justify-center text-muted-foreground bg-muted/30 rounded-xl border border-dashed p-8">
                                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                                    <Table className="h-8 w-8 text-muted-foreground/70" />
                                </div>
                                <p className="text-center font-medium">Không có dữ liệu</p>
                                <p className="text-center text-sm mt-1">Gửi truy vấn để tạo dữ liệu phân khúc</p>
                            </div>
                        )}
                    </TabsContent>
                </CardContent>

                <CreateAISegmentation
                    open={isOpenDialog}
                    onClose={() => setIsOpenDialog(false)}
                    onCreateSegment={handleSaveSegment} />
            </Tabs>
        </Card>
    )
}
