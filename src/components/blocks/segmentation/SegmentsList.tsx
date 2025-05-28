"use client";

import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Search, ArrowUpDown, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Segment, SegmentsListProps } from "@/types/segmentTypes";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { axiosPrivate } from "@/API/axios";
import AuthContext from "@/context/AuthContext";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { formatDateTime } from "@/utils/rfmFunctionHelper";

const ITEMS_PER_PAGE = 7;

const SegmentsList: React.FC<SegmentsListProps> = ({ segments = [], onCreateSegment, onEditSegment }) => {
    const [localSegments, setLocalSegments] = useState<Segment[]>([]);
    const [segmentList, setSegmentList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const { user, token } = useContext(AuthContext);

    const fetchSegments = () => {
        try {
            axiosPrivate.post('/segment/get-all-by-user', { user_id: user.user_id }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
                .then((response) => {
                    if (response.data.status === 200) {
                        toast.success(response.data.message)
                    }
                    setSegmentList(response.data.data)
                })
                .catch((error) => {
                    console.error(error)
                    toast.error('have a error when get segment list: ', error)
                })
        } catch (error) {
            console.error("Error loading segments from localStorage:", error);
        }
    }

    useEffect(() => {
        try {
            fetchSegments();
        } catch (error) {
            console.error("Error loading segments:", error);
        }
    }, [segments]);

    // Tìm kiếm và sắp xếp segments
    const filteredAndSortedSegments = segmentList
        .filter(segment => 
            segment.segment_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            segment.segment_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            segment.dataset.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            const dateA = new Date(a.updated_at).getTime();
            const dateB = new Date(b.updated_at).getTime();
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });

    // Tính toán phân trang
    const totalPages = Math.ceil(filteredAndSortedSegments.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedSegments = filteredAndSortedSegments.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handleRowClick = (segment: Segment) => {
        if (onEditSegment) {
            onEditSegment(segment);
        }
    };

    const handleUpdateSegmentStatus = (segment: Segment) => {
        try {
            axiosPrivate.put('/segment/update-status', {
                segment_id: segment.segment_id,
                status: segment.status
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((res) => {
                    if (res.status === 200) {
                        toast.success(res.data.message);
                        fetchSegments();
                    }
                    else toast.error(res.data.error)
                })
                .catch((err) => {
                    toast.error(err.message)
                })
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleDeleteSegment = (segment: Segment) => {
        try {
            axiosPrivate.put('/segment/delete', {
                segment_id: segment.segment_id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((res) => {
                    if (res.status === 200) {
                        toast.success(res.data.message);
                        fetchSegments();
                    }
                    else toast.error(res.data.error)
                })
                .catch((err) => {
                    toast.error(err.message)
                })
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="space-y-4 pb-4">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">Các phân khúc</h1>
                <Button onClick={onCreateSegment}>
                    <Plus className="mr-2" size={16} /> Tạo phân khúc mới
                </Button>
            </div>

            <div className="flex justify-between items-center gap-4">
                <div className="relative w-72">
                    <Input
                        placeholder="Tìm kiếm phân khúc..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
                        }}
                        className="pl-10"
                    />
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Sắp xếp theo:</span>
                    <Select
                        value={sortOrder}
                        onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Chọn thứ tự sắp xếp" />
                        </SelectTrigger>
                        <SelectContent className="bg-card">
                            <SelectItem className="hover:bg-background" value="desc">Mới nhất trước</SelectItem>
                            <SelectItem className="hover:bg-background" value="asc">Cũ nhất trước</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Card>
                <Table className="w-full">
                    <TableHeader>
                        <TableRow className="w-full">
                            <TableHead className="w-2/6 px-4 text-left">ID</TableHead>
                            <TableHead className="w-1/6 px-4 text-left">Tên phân khúc</TableHead>
                            <TableHead className="w-1/6 px-4 text-center">Tập dữ liệu</TableHead>
                            <TableHead className="w-1/6 px-4 text-center">Tạo ngày</TableHead>
                            <TableHead className="w-1/6 px-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                    Cập nhật lần cuối
                                    <ArrowUpDown 
                                        size={14} 
                                        className="cursor-pointer"
                                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                    />
                                </div>
                            </TableHead>
                            <TableHead className="w-1/6 px-4 text-center">Trạng thái</TableHead>
                            <TableHead className="w-1/6 px-4 text-center">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="px-4">
                        {paginatedSegments.length > 0 ? (
                            paginatedSegments.map((segment) => (
                                <TableRow key={segment.segment_id} className="cursor-pointer hover:bg-background overflow-hidden">
                                    <TableCell className="px-4 text-left" onClick={() => handleRowClick(segment)}>
                                        {segment.segment_id}
                                    </TableCell>
                                    <TableCell className="px-4 text-left" onClick={() => handleRowClick(segment)}>
                                        {segment.segment_name}
                                    </TableCell>
                                    <TableCell className="px-4 text-center" onClick={() => handleRowClick(segment)}>{segment.dataset}</TableCell>
                                    <TableCell className="px-4 text-center" onClick={() => handleRowClick(segment)}>
                                        {formatDateTime(segment.created_at)}
                                    </TableCell>
                                    <TableCell className="px-4 text-center" onClick={() => handleRowClick(segment)}>
                                        {formatDateTime(segment.updated_at)}
                                    </TableCell>
                                    <TableCell className="px-4 text-center" onClick={() => handleRowClick(segment)}>
                                        <Badge className={`${segment.status === "active" ? "bg-primary" : "bg-error"} text-secondary`}>
                                            {segment.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-4">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <MoreHorizontal size={18} className="cursor-pointer hover:bg-gray-300 rounded-xl w-6 h-4" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="mr-4 bg-card">
                                                <DropdownMenuItem
                                                    className="hover:bg-gray-100"
                                                    onClick={() => handleUpdateSegmentStatus(segment)}
                                                >
                                                    {segment.status === "active" ? "Vô hiệu hoá" : "Kích hoạt"}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    className="hover:bg-red-200 text-red-500"
                                                    onClick={() => handleDeleteSegment(segment)}>
                                                    Xoá phân khúc
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                                    {searchTerm ? "Không tìm thấy phân khúc phù hợp" : "Chưa có phân khúc nào"}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                {filteredAndSortedSegments.length > 0 && (
                    <div className="flex items-center justify-between px-4 py-4 border-t">
                        <div className="text-sm text-muted-foreground">
                            Hiển thị {startIndex + 1} đến {Math.min(startIndex + ITEMS_PER_PAGE, filteredAndSortedSegments.length)} trong tổng số {filteredAndSortedSegments.length} phân khúc
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <Button
                                        key={page}
                                        variant={currentPage === page ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handlePageChange(page)}
                                        className="w-8"
                                    >
                                        {page}
                                    </Button>
                                ))}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default SegmentsList;
