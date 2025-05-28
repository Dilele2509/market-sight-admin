"use client"

import { axiosPrivate } from "@/API/axios";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AuthContext from "@/context/AuthContext";
import { format } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { formatDateTime, translateSegmentName } from "@/utils/rfmFunctionHelper";

const generateColor: Record<string, string> = {
    "Champions": "#1D5C4D",
    "Loyal Customers": "#4D8C8C",
    "Potential Loyalist": "#6A9F86",
    "New Customers": "#4A91D6",
    "Promising": "#86C3E6",
    "Need Attention": "#EA8D00",
    "About To Sleep": "#5A8A9D",
    "Can't Lose Them": "#FF9B4B",
    "At Risk": "#F24A4A",
    "Hibernating": "#4B8FB7",
    "Lost": "#B85B5B",
};

type rfmTableData = {
    segment: string,
    customers: {
        customer_id: string,
        business_id: number,
        first_name: string,
        last_name: string,
        email: string,
        phone: string,
        gender: string,
        birth_date: string,
        registration_date: string,
        address: string,
        city: string,
        recency_value: number,
        frequency_value: number,
        monetary_value: number,
        r_score: number,
        f_score: number,
        m_score: number,
        segment: string,
        last_updated: string
    }[];
    count: number
}

interface RfmSegmentTableProps {
    startDate: string,
    endDate: string
}

export function RfmSegmentTable({ startDate, endDate }: RfmSegmentTableProps) {
    const [selectedSegment, setSelectedSegment] = useState("Champions");
    const [rfmData, setRfmData] = useState<rfmTableData[]>();
    const { token } = useContext(AuthContext);

    const tabList = [
        "Champions",
        "Loyal Customers",
        "Potential Loyalist",
        "New Customers",
        "Promising",
        "Need Attention",
        "About To Sleep",
        "Can't Lose Them",
        "At Risk",
        "Hibernating",
        "Lost"
    ];

    const fetchTableData = async () => {
        try {
            const res = await axiosPrivate.post('/rfm/segment-customers',
                {
                    start_date: format(startDate, "yyyy-MM-dd"),
                    end_date: format(endDate, "yyyy-MM-dd")
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            setRfmData(res.data?.data?.segments);
        } catch (error: any) {
            console.error(error.message)
        }
    }

    useEffect(() => {
        fetchTableData()
    }, [startDate, endDate]);

    const selectedData = rfmData?.find(s => s.segment === selectedSegment);

    return (
        <div className="space-y-4 pb-10">
            <div className="w-full flex justify-end">
                <div className="w-full max-w-xs">
                    <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                        <SelectTrigger className="w-full bg-card">
                            <SelectValue placeholder="Chọn phân khúc" />
                        </SelectTrigger>
                        <SelectContent className="bg-card">
                            {tabList.map((segment) => (
                                <SelectItem
                                    key={segment}
                                    value={segment}
                                    className="hover:bg-muted hover:text-foreground cursor-pointer"
                                >
                                    {translateSegmentName(segment)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="min-w-[300px]">ID Khách hàng</TableHead>
                        <TableHead className="min-w-[150px]">Họ</TableHead>
                        <TableHead className="min-w-[150px]">Tên</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="min-w-[150px]">Số điện thoại</TableHead>
                        <TableHead className="min-w-[100px]">Giới tính</TableHead>
                        <TableHead className="min-w-[150px]">Ngày sinh</TableHead>
                        <TableHead className="min-w-[200px]">Địa chỉ</TableHead>
                        <TableHead className="min-w-[150px]">Thành Phố</TableHead>
                        <TableHead className="min-w-[250px]">Ngày đăng kí tài khoản</TableHead>
                        <TableHead className="min-w-[250px]">Thời gian mua gần nhất (ngày)</TableHead>
                        <TableHead className="min-w-[150px]">Tần suất mua</TableHead>
                        <TableHead>Chi tiêu</TableHead>
                        <TableHead>R</TableHead>
                        <TableHead>F</TableHead>
                        <TableHead>M</TableHead>
                        <TableHead className="min-w-[180px]">Cập nhật lúc</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {selectedData?.customers.length > 0 ? (
                        selectedData.customers.map((customer) => (
                            <TableRow key={customer.customer_id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center space-x-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: generateColor[selectedSegment] }}
                                        />
                                        <span>{customer.customer_id}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{customer.first_name}</TableCell>
                                <TableCell>{customer.last_name}</TableCell>
                                <TableCell>{customer.email}</TableCell>
                                <TableCell>{customer.phone}</TableCell>
                                <TableCell>{customer.gender === "F" ? "Nữ" : "Nam"}</TableCell>
                                <TableCell>{customer.birth_date}</TableCell>
                                <TableCell>{customer.address}</TableCell>
                                <TableCell>{customer.city}</TableCell>
                                <TableCell>{customer.registration_date}</TableCell>
                                <TableCell>{customer.recency_value}</TableCell>
                                <TableCell>{customer.frequency_value}</TableCell>
                                <TableCell>{customer.monetary_value}</TableCell>
                                <TableCell>{customer.r_score}</TableCell>
                                <TableCell>{customer.f_score}</TableCell>
                                <TableCell>{customer.m_score}</TableCell>
                                <TableCell>{formatDateTime(customer.last_updated)}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={18} className="text-center text-gray-500">
                                Không có khách hàng nào thuộc phân khúc này
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
