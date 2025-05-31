import { DashboardShell } from "@/components/layout/DashboardShell"
import { TableView } from "@/components/blocks/TableData/table-view"
import { Sidebar } from "@/components/blocks/TableData/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { Customer, ProductLine, Store, TableType, Transaction } from "@/types/table"
import { useToast } from "@/components/ui/use-toast"
import { axiosPrivate } from "@/API/axios"
import { useContext } from "react"
import AuthContext from "@/context/AuthContext"
import { Loading } from "@/components/ui/loading"
import { toast } from "sonner"

interface TableData {
    customers: Customer[]
    transactions: Transaction[]
    stores: Store[]
    product_lines: ProductLine[]
}

export default function TableData() {
    const [selectedTable, setSelectedTable] = useState<TableType>("customers")
    const [tableData, setTableData] = useState<TableData>({
        customers: [],
        transactions: [],
        stores: [],
        product_lines: []
    })
    const [isLoading, setIsLoading] = useState(true)
    const { token } = useContext(AuthContext)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosPrivate.get('/tables', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                console.log('API Response:', response.data)
                setTableData(response.data)
            } catch (error) {
                console.error('Error fetching table data:', error)
                toast.error("Failed to fetch table data")
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [token])

    const handleAdd = async (data: any) => {
        try {
            // TODO: Implement API call to add data
            toast.success("Dữ liệu đã được thêm thành công")
        } catch (error) {
            toast.error("Không thể thêm dữ liệu")
        }
    }

    const handleDelete = async (ids: string[]) => {
        try {
            const response = await axiosPrivate.delete('/tables', {
                data: {
                    tableName: selectedTable,
                    ids: ids
                }
            })
            // console.log({ tableName: selectedTable, ids: ids })

            // const response = {
            //     data: {
            //         success: true,
            //         message: "Xóa dữ liệu thành công",
            //         deletedCount: ids.length
            //     }
            // }

            const { success, message, deletedCount } = response.data

            if (success) {
                toast.success(message, {
                    description: `Đã xóa ${deletedCount} bản ghi`
                })
                // Refresh data after successful deletion
                const updatedResponse = await axiosPrivate.get('/tables')
                setTableData(updatedResponse.data)
            } else {
                toast.error("Xóa dữ liệu thất bại")
            }
        } catch (error) {
            console.error('Error deleting data:', error)
            toast.error("Không thể xóa dữ liệu")
        }
    }

    return (
        <DashboardShell>
            <div className="w-full p-6 -mt-6">
                <h1 className="text-3xl font-bold mb-6">Quản lý dữ liệu</h1>
                <div className="flex gap-6 h-full">
                    <Sidebar
                        selectedTable={selectedTable}
                        onTableSelect={setSelectedTable}
                    />
                    <div className="flex-1 min-w-0">
                        <Card className="h-full">
                            <CardContent className="p-6 h-full">
                                {isLoading ? (
                                    <Loading />
                                ) : (
                                    <TableView
                                        type={selectedTable}
                                        data={tableData[selectedTable]}
                                        onAdd={handleAdd}
                                        onDelete={handleDelete}
                                        isLoading={isLoading}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardShell>
    )
}
