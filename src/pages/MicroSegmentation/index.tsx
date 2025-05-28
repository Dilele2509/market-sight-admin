import { DashboardShell } from "@/components/layout/DashboardShell";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useSegmentData } from "@/context/SegmentDataContext";

export default function MicroSegmentation() {
    const navigate = useNavigate();
    const location = useLocation();
    const { CONNECTION_EXPIRY_KEY } = useSegmentData();
    const connection = localStorage.getItem(CONNECTION_EXPIRY_KEY)

    return (
        <DashboardShell>
            {!connection ? (
                <div className="flex flex-col gap-6 items-center justify-center h-[60vh]">
                    <Alert variant="destructive" className="max-w-md text-center">
                        <AlertTitle>Yêu cầu kết nối cơ sở dữ liệu</AlertTitle>
                        <AlertDescription>
                            Chưa có dữ liệu nào được nhập. Vui lòng điều hướng đến trang Nhập dữ liệu để kết nối với cơ sở dữ liệu của bạn.
                        </AlertDescription>
                    </Alert>
                    <Button onClick={() => navigate("/connect-data")} className="mt-4">
                        Đi đến kết nối
                    </Button>
                </div>
            ) : (<div className="flex flex-col gap-6">
                <h1 className="text-3xl font-bold tracking-tight">Phân Khúc Vi Mô</h1>
                <Tabs
                    defaultValue="rfm"
                    value={["rfm", "lifecycle"].includes(location.pathname.split("/").pop()) ? location.pathname.split("/").pop() : "rfm"}
                    onValueChange={(value) => navigate(`/micro-segmentation/${value}`)}
                >
                    <TabsList className="bg-card-foreground">
                        <TabsTrigger className="text-card" value="rfm">Phân tích RFM</TabsTrigger>
                        <TabsTrigger className="text-card" value="lifecycle">Phân tích Vòng Đời Khách Hàng</TabsTrigger>
                    </TabsList>
                </Tabs>

                <Outlet />
            </div>)}
        </DashboardShell>
    );
}

