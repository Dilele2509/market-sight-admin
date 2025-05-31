"use client";

import { useState } from "react";
import { TableView } from "@/components/blocks/TableData/table-view";
import { TableType } from "@/types/table";
import { useToast } from "@/components/ui/use-toast";

export default function TableDataPage() {
  const [selectedTable, setSelectedTable] = useState<TableType>("customers");
  const { toast } = useToast();

  const handleAdd = async (data: any) => {
    try {
      // TODO: Implement API call to add data
      toast({
        title: "Thành công",
        description: "Dữ liệu đã được thêm thành công",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể thêm dữ liệu",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (ids: number[]) => {
    try {
      // TODO: Implement API call to delete data
      toast({
        title: "Thành công",
        description: "Dữ liệu đã được xóa thành công",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa dữ liệu",
        variant: "destructive",
      });
    }
  };

  // Mock data for testing
  const mockData = {
    customers: [
      {
        customer_id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        phone: "0123456789",
        address: "123 Main St",
        created_at: "2024-03-15T10:00:00Z",
        updated_at: "2024-03-15T10:00:00Z"
      }
    ],
    transactions: [
      {
        transaction_id: 1,
        customer_id: 1,
        store_id: 1,
        product_line_id: 1,
        quantity: 2,
        total_amount: 200000,
        transaction_date: "2024-03-15T10:00:00Z",
        created_at: "2024-03-15T10:00:00Z",
        updated_at: "2024-03-15T10:00:00Z"
      }
    ],
    stores: [
      {
        store_id: 1,
        name: "Store 1",
        address: "456 Market St",
        phone: "0987654321",
        email: "store1@example.com",
        created_at: "2024-03-15T10:00:00Z",
        updated_at: "2024-03-15T10:00:00Z"
      }
    ],
    product_lines: [
      {
        product_line_id: 1,
        name: "Product 1",
        description: "Description 1",
        price: 100000,
        created_at: "2024-03-15T10:00:00Z",
        updated_at: "2024-03-15T10:00:00Z"
      }
    ]
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Quản lý dữ liệu</h1>
        <div className="flex items-center gap-2">
          <select
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value as TableType)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="customers">Khách hàng</option>
            <option value="transactions">Giao dịch</option>
            <option value="stores">Cửa hàng</option>
            <option value="product_lines">Sản phẩm</option>
          </select>
        </div>
      </div>

      <TableView
        type={selectedTable}
        data={mockData[selectedTable]}
        onAdd={handleAdd}
        onDelete={handleDelete}
      />
    </div>
  );
} 