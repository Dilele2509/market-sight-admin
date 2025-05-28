import { axiosPrivate } from "@/API/axios";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import AuthContext from "@/context/AuthContext";
import { useSegmentData } from "@/context/SegmentDataContext";
import { Label } from "@radix-ui/react-label";
import { Download } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { GoogleSheetDialog } from "../../SyncData/googleSheetDialog";
import clsx from "clsx";
import { RequestAuth } from "../../SyncData/requestAuthDialog";

const RenderSync = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogOpenNotify, setDialogOpenNotify] = useState(false)
    const { previewData, segmentId, segmentName } = useSegmentData();
    const { token } = useContext(AuthContext)

    useEffect(() => {
        console.log("check preview from sync: ", previewData);
        console.log(segmentId);
    }, [previewData]);

    if (!previewData || previewData.length === 0) {
        return <h2>Nhấn vào nút Xem trước kết quả ở trên để hiển thị dữ liệu trước khi đồng bộ hóa</h2>;
    }

    // Lấy danh sách các keys từ object đầu tiên để làm header
    const headers = Object.keys(previewData[0]);

    const headerToken = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const startInsertToState = async () => {
        try {
            const res = await axiosPrivate.post('/segment/add-state-sync', {
                segment_id: segmentId, data: previewData
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (res.status === 200) {
                toast.success('Thêm vào state thành công')
                const resTokenCheck = await axiosPrivate.get('/auth/status', headerToken)
                console.log('check res token: ', resTokenCheck);
                if (resTokenCheck.data?.data?.is_connected === true) {
                    toast.success('Xác minh quyền thành công')
                    setDialogOpen(true)
                } else {
                    console.error(resTokenCheck)
                    setDialogOpenNotify(true)
                }
            } else {
                console.log(res);
                toast.error('Lỗi khi thêm dữ liệu vào state')
            }
        } catch (error) {
            console.error(error.message)
        }
    }

    const handleSync = async (option: 'create' | 'use', value: string) => {
        setIsLoading(true)
        let req = {}

        if (option === 'create') {
            req = {
                segment_id: segmentId,
                segment_name: segmentName,
                create_new: true,
                new_file_name: value,
            }
            console.log('Create new file with name:', req)
        } else {
            req = {
                segment_id: segmentId,
                segment_name: segmentName,
                create_new: false,
                sheet_url: value,
            }
            console.log('Use existing sheet with link:', value)
        }

        try {
            const res = await axiosPrivate.post('/sync', req, headerToken)
            console.log(res);

            if (res.data.success === true) {
                toast.success('Đồng bộ thành công, hãy kiểm tra Google Drive của bạn ngay')
            } else {
                toast.error('Đã xảy ra lỗi trong quá trình đồng bộ hóa. Xem bảng điều khiển để biết chi tiết.')
                console.error(res.data)
            }
        } catch (err) {
            toast.error('Yêu cầu không thành công. Kiểm tra bảng điều khiển để biết chi tiết.')
            console.error('Lỗi đồng bộ:', err)
        } finally {
            setIsLoading(false)
            setDialogOpen(false)
        }
    }

    return (
        <div className="">
            <div className="flex w-full justify-end items-center gap-4">
                <Label className="text-sm font-medium">Nhấp để đồng bộ:</Label>
                <Button className="text-card bg-primary-dark" onClick={startInsertToState}><Download />Đồng bộ dữ liệu</Button>
            </div>
            <div className="rounded-md border mt-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {headers.map((key) => (
                                <TableHead key={key}>{key}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {previewData.map((row: Record<string, any>, index: number) => (
                            <TableRow key={index}>
                                {headers.map((key) => (
                                    <TableCell key={key}>
                                        {typeof row[key] === "string" || typeof row[key] === "number"
                                            ? row[key]
                                            : JSON.stringify(row[key])}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <RequestAuth open={dialogOpenNotify} onClose={() => setDialogOpenNotify(false)} />
            <GoogleSheetDialog open={dialogOpen} isLoading={isLoading} onClose={() => setDialogOpen(false)} onSync={handleSync} />
        </div>
    );
};

export default RenderSync;
