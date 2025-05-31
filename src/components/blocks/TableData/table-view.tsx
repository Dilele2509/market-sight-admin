"use client"

import type React from "react"

import { useState } from "react"
import { ChevronRight, Copy, Edit, MoreHorizontal, Trash, Plus, RefreshCw } from "lucide-react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTableData } from "@/hooks/use-table-data" 
import { EditCellDialog } from "./edit-cell-dialog"
import { AddDataDialog } from "./add-data-dialog" 
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { formatDate } from "@/lib/utils"
import { TableType, TableData, TABLE_CONFIG } from "@/types/table"
import { Trash2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface TableViewProps {
    type: TableType
    data: TableData[]
    onAdd: (data: Partial<TableData>) => Promise<void>
    onDelete: (ids: string[]) => Promise<void>
    isLoading?: boolean
}

export function TableView({ type, data = [], onAdd, onDelete, isLoading = false }: TableViewProps) {
    const { getTableData, updateCell, deleteRow, addRow } = useTableData()
    const [selectedRows, setSelectedRows] = useState<string[]>([])
    const [editCell, setEditCell] = useState<{ rowId: string; column: string; value: string } | null>(null)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const config = TABLE_CONFIG[type]
    const idKey = `${type.slice(0, -1)}_id` as keyof TableData

    const tableData = getTableData(type)

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedRows(data.map(item => String(item[idKey])))
        } else {
            setSelectedRows([])
        }
    }

    const handleSelectRow = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedRows([...selectedRows, id])
        } else {
            setSelectedRows(selectedRows.filter(rowId => rowId !== id))
        }
    }

    const handleDelete = async () => {
        await onDelete(selectedRows)
        setSelectedRows([])
        setIsDeleteDialogOpen(false)
    }

    const handleCellEdit = (rowId: string, column: string, value: string) => {
        setEditCell({ rowId, column, value })
    }

    const handleSaveCell = (newValue: string) => {
        if (editCell) {
            updateCell(type, editCell.rowId, editCell.column, newValue)
            setEditCell(null)
        }
    }

    const handleAddNewRow = () => {
        setIsAddDialogOpen(true)
    }

    const formatCellValue = (key: string, value: any) => {
        if (key.includes('_at') || key.includes('_date')) {
            return formatDate(value)
        }
        if (key.includes('price') || key.includes('amount') || key.includes('cost')) {
            return new Intl.NumberFormat('vi-VN', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(value)
        }
        return value
    }

    const renderTableContent = () => {
        if (isLoading) {
            return (
                <TableBody>
                    {[1, 2, 3].map((i) => (
                        <TableRow key={i}>
                            <TableCell className="w-[50px]">
                                <Skeleton className="h-4 w-4" />
                            </TableCell>
                            {config.columns.map((column) => (
                                <TableCell key={column.key} className="min-w-[150px]">
                                    <Skeleton className="h-4 w-[100px]" />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            )
        }

        if (!data || data.length === 0) {
            return (
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={config.columns.length + 1} className="text-center py-4">
                            No data available
                        </TableCell>
                    </TableRow>
                </TableBody>
            )
        }

        return (
            <TableBody>
                {data.map((row) => (
                    <TableRow key={row[idKey]}>
                        <TableCell className="w-[50px]" onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                                checked={selectedRows.includes(String(row[idKey]))}
                                onCheckedChange={(checked) => 
                                    handleSelectRow(String(row[idKey]), checked as boolean)
                                }
                            />
                        </TableCell>
                        {config.columns.map((column) => (
                            <TableCell key={column.key} className="min-w-[150px]">
                                {formatCellValue(column.key, row[column.key as keyof TableData])}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">{config.title}</h2>
                <div className="flex items-center gap-2">
                    {selectedRows.length > 0 && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setIsDeleteDialogOpen(true)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete ({selectedRows.length})
                        </Button>
                    )}
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Data
                    </Button>
                </div>
            </div>

            <div className="rounded-md border">
                <div className="max-h-[calc(100vh-300px)] overflow-auto">
                    <div className="min-w-full inline-block align-middle">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="sticky top-0 bg-background z-10">
                                    <TableRow>
                                        <TableHead className="w-[50px]">
                                            <Checkbox
                                                checked={data.length > 0 && selectedRows.length === data.length}
                                                onCheckedChange={handleSelectAll}
                                            />
                                        </TableHead>
                                        {config.columns.map((column) => (
                                            <TableHead key={column.key} className="min-w-[150px]">
                                                {column.label}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                {renderTableContent()}
                            </Table>
                        </div>
                    </div>
                </div>
            </div>

            <AddDataDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                type={type}
                onAdd={onAdd}
            />

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete {selectedRows.length} selected items? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {editCell && (
                <EditCellDialog
                    isOpen={!!editCell}
                    onClose={() => setEditCell(null)}
                    initialValue={editCell.value}
                    onSave={handleSaveCell}
                    column={editCell.column}
                />
            )}
        </div>
    )
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return <input {...props} className={`px-3 py-1 text-sm ${props.className}`} />
}
