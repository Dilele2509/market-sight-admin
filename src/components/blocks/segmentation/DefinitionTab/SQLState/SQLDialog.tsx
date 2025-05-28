import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSegmentData } from "@/context/SegmentDataContext";
import { useSegmentToggle } from "@/context/SegmentToggleContext";
import { convertSQLToSegment } from "@/utils/segmentFunctionConvert";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false })

export default function SQLDialog() {
    const { setSqlError, setEditableSql, editableSql, setRootOperator, setConditions, setConditionGroups, sqlError } = useSegmentData();
    const { setSqlDialogOpen, sqlDialogOpen } = useSegmentToggle();
    const [isLoading, setIsLoading] = useState(false)

    // Function to close SQL dialog
    const handleCloseSqlDialog = () => {
        setSqlDialogOpen(false);
    };

    // Function to handle SQL changes
    const handleSqlChange = (value: string | undefined) => {
        setEditableSql(value || "");
        setSqlError(null);
    };

    const handleApplySqlChanges = () => {
        setIsLoading(true)
        const sqlQuery = editableSql.trim();
        try {
            console.log(convertSQLToSegment(sqlQuery))
            setConditions(convertSQLToSegment(sqlQuery).conditions)
            setConditionGroups(convertSQLToSegment(sqlQuery).groupConditions)
            setRootOperator(convertSQLToSegment(sqlQuery).rootOperator)
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false)
            handleCloseSqlDialog()
        }
    };

    return (
        sqlDialogOpen && (
            <Dialog open={sqlDialogOpen} onOpenChange={handleCloseSqlDialog}>
                <DialogContent className="max-w-2xl w-full">
                    <DialogHeader>
                        <DialogTitle>Trình soạn thảo truy vấn SQL</DialogTitle>
                        <DialogDescription>
                            Chỉnh sửa truy vấn SQL bên dưới để sửa đổi điều kiện phân khúc của bạn. Những thay đổi sẽ được phản ánh trong trình xây dựng phân khúc.
                        </DialogDescription>
                    </DialogHeader>
                    {/* <Textarea
                        className="w-full h-96 font-mono text-sm whitespace-pre-wrap mt-2"
                        value={editableSql}
                        onChange={(e) => handleSqlChange(e.target.value)}
                        placeholder="Enter SQL query here..."
                    /> */}
                    <div className="w-full bg-[#1e1e1e] py-4 h-96 rounded-lg overflow-hidden">
                        <MonacoEditor
                            height="100%"
                            defaultLanguage="sql"
                            value={editableSql}
                            onChange={handleSqlChange}
                            theme="vs-dark"
                            options={{
                                fontSize: 14,
                                minimap: { enabled: false },
                                automaticLayout: true,
                                scrollBeyondLastLine: false,
                                wordWrap: "on",
                            }}
                        />
                    </div>
                    {sqlError && <p className="text-red-500 text-sm mt-2">{sqlError}</p>}
                    <p className="text-xs text-gray-500 mt-1">
                        Lưu ý: Phân tích cú pháp SQL bị giới hạn ở các điều kiện đơn giản. Các truy vấn phức tạp có thể không phân tích cú pháp chính xác.
                    </p>
                    <DialogFooter>
                        <Button variant="ghost" onClick={handleCloseSqlDialog}>
                            Huỷ
                        </Button>
                        <Button variant="default" onClick={handleApplySqlChanges}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Đang áp dụng thay đổi...
                                </>
                            ) : (
                                <>
                                    Áp dụng thay đổi
                                </>
                            )}
                        </Button>

                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    );
}