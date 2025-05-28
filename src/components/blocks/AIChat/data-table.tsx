import { axiosPrivate } from "@/API/axios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import AuthContext from "@/context/AuthContext";
import { useSegmentData } from "@/context/SegmentDataContext";
import type { CustomerData, ResponseData } from "@/types/aichat"
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { LoadingCircles } from "./loading-circles";
import { SearchX } from "lucide-react";
import { useAiChatContext } from "@/context/AiChatContext";

interface DataTableProps {
    previewResponseData?: ResponseData;
}

export function DataTable({ previewResponseData }: DataTableProps) {
    const { sqlQuery, setPreviewData, previewData, CONNECTION_STORAGE_KEY, selectedDataset } = useAiChatContext()
    const { token } = useContext(AuthContext)
    const [previewLoading, setPreviewLoading] = useState(false)
    // Function to fetch preview data based on current conditions
    const fetchPreviewData = async () => {
        // Only fetch if we don't have preview response data
        if (previewResponseData) {
            return;
        }

        setPreviewLoading(true);

        try {
            const connectionUrl = localStorage.getItem(CONNECTION_STORAGE_KEY)

            if (!connectionUrl) {
                toast.error("Connection URL not configured. Please set the connection URL first.");
                setPreviewLoading(false);
                return;
            }

            // console.log("Executing SQL query for preview:", sqlQuery);

            try {
                const url = new URL(connectionUrl);
                const username = url.username;
                const password = url.password;
                const host = url.hostname;
                const port = url.port;
                const database = url.pathname.replace('/', '');

                // Format request data to match what the API expects
                const requestData = {
                    table: selectedDataset.name,
                    query: sqlQuery,
                    connection_details: {
                        url,
                        host,
                        port,
                        database,
                        username,
                        password
                    }
                };

                // Log request WITHOUT showing password
                // console.log("Sending request to API with connection details:", {
                //     table: requestData.table,
                //     query: requestData.query,
                //     connection_details: {
                //         url: requestData.connection_details.url,
                //         host: requestData.connection_details.host,
                //         port: requestData.connection_details.port,
                //         database: requestData.connection_details.database,
                //         username: requestData.connection_details.username,
                //         password: "********" // Mask password in logs
                //     }
                // });

                // Call the API endpoint
                const response = await axiosPrivate.post(`/data/query`, requestData, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Only log the success status, not the full response which might contain sensitive data
                console.log(`Query executed successfully. Status: ${response}, Records: ${response.data?.data?.length || 0}`);

                // Process the response as before
                if (response.data && response.data.success) {
                    setPreviewData(response.data.data || []);

                    if (response.data.data && response.data.data.length > 0) {
                        //console.log(response.data?.data);
                        toast.success(`Retrieved ${response.data.data.length} records`);
                    } else {
                        toast.warning("Query executed successfully but returned no records");
                    }
                } else {
                    toast.warning("No results returned. Your query may be too restrictive or there's no matching data.");
                    setPreviewData([]);
                }
            } catch (error) {
                // Ensure any error messages are sanitized before logging
                const sanitizedError = error.message?.replace(/postgresql:\/\/[^:]+:[^@]+@/g, 'postgresql://****:****@');
                console.error('Error executing query:', sanitizedError);

                // Handle different error types without exposing sensitive information
                if (error.response) {
                    const errorDetail = error.response.data?.detail || "Unknown error occurred";
                    // Sanitize the error message
                    const sanitizedDetail = errorDetail.replace(/postgresql:\/\/[^:]+:[^@]+@/g, 'postgresql://****:****@');
                    toast.error(`Query error: ${sanitizedDetail}`);
                } else if (error.request) {
                    toast.error("No response from server. Check your network connection.");
                } else {
                    toast.error(`Error: ${sanitizedError}`);
                }

                setPreviewData([]);
            }
        } catch (error) {
            // Sanitize any unexpected errors
            const sanitizedError = error.message?.replace(/postgresql:\/\/[^:]+:[^@]+@/g, 'postgresql://****:****@');
            console.error('Unexpected error:', sanitizedError);
            toast.error(`Unexpected error: ${sanitizedError}`);
            setPreviewData([]);
        } finally {
            setPreviewLoading(false);
        }
    };

    useEffect(() => {
        if (!previewResponseData) {
            fetchPreviewData()
        } else {
            // If we have preview response data, use it directly
            const data = previewResponseData.data?.filter_criteria?.conditions || [];
            setPreviewData(data);
        }
    }, [sqlQuery, previewResponseData])

    const displayData = previewResponseData?.data?.filter_criteria?.conditions || previewData;

    return (
        <div className={`h-full rounded-md border overflow-hidden ${(!previewResponseData && previewData?.length === 0) && 'flex items-center justify-center'}`}>
            {!previewLoading ? (
                <>
                    {displayData.length > 0 ? <div className="max-h-full relative overflow-auto">
                        <Table className="min-w-full border-collapse">
                            <TableHeader className="sticky top-0 z-10 bg-background shadow-sm">
                                <TableRow>
                                    <TableHead>Mã khách hàng</TableHead>
                                    <TableHead>Họ</TableHead>
                                    <TableHead>Tên</TableHead>
                                    <TableHead>Ngày sinh</TableHead>
                                    <TableHead>Giới tính</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Số điện thoại</TableHead>
                                    <TableHead>Địa chỉ</TableHead>
                                    <TableHead>Thành phố</TableHead>
                                    <TableHead className="text-right">Ngày tạo tài khoản</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="max-h-full relative overflow-auto">
                                {displayData.map((customer: CustomerData) => (
                                    <TableRow key={customer.customer_id}>
                                        <TableCell className="font-medium">{customer.customer_id}</TableCell>
                                        <TableCell>{customer.first_name}</TableCell>
                                        <TableCell>{customer.last_name}</TableCell>
                                        <TableCell>{customer.birth_date}</TableCell>
                                        <TableCell>{customer.gender}</TableCell>
                                        <TableCell>{customer.email}</TableCell>
                                        <TableCell>{customer.phone}</TableCell>
                                        <TableCell>{customer.address}</TableCell>
                                        <TableCell>{customer.city}</TableCell>
                                        <TableCell className="text-right">{customer.registration_date}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div> :
                        <div className='flex flex-col items-center justify-center'>
                            <SearchX size={40} className="mb-4 text-red-600" />
                            <div className='text-base text-center font-normal'>
                                <h1 className="text-lg font-semibold">Không tìm thấy kết quả phù hợp 😕</h1>
                                Truy vấn của bạn có thể quá hạn chế, hoặc không có dữ liệu trùng khớp.
                            </div>
                        </div>}
                </>
            ) : (
                <div className="h-[calc(100%-2rem)] flex flex-col items-center justify-center">
                    <LoadingCircles />
                    <p className="mt-5 text-sm font-medium">Đang tạo dữ liệu phân khúc...</p>
                    <p className="text-xs text-muted-foreground mt-1">Quá trình này có thể mất vài giây</p>
                </div>
            )}
        </div>
    )
}
