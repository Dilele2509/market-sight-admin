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

interface TableViewProps {
    tableName: string
}

export function TableView({ tableName }: TableViewProps) {
    const { getTableData, updateCell, deleteRow, addRow } = useTableData()
    const [selectedRows, setSelectedRows] = useState<string[]>([])
    const [editCell, setEditCell] = useState<{ rowId: string; column: string; value: string } | null>(null)

    const tableData = getTableData(tableName)

    const toggleRow = (rowId: string) => {
        setSelectedRows((prev) => (prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]))
    }

    const toggleAllRows = () => {
        if (selectedRows.length === tableData.rows.length) {
            setSelectedRows([])
        } else {
            setSelectedRows(tableData.rows.map((row) => row.id))
        }
    }

    const handleCellEdit = (rowId: string, column: string, value: string) => {
        setEditCell({ rowId, column, value })
    }

    const handleSaveCell = (newValue: string) => {
        if (editCell) {
            updateCell(tableName, editCell.rowId, editCell.column, newValue)
            setEditCell(null)
        }
    }

    const handleDeleteRow = (rowId: string) => {
        deleteRow(tableName, rowId)
        setSelectedRows((prev) => prev.filter((id) => id !== rowId))
    }

    const handleAddNewRow = () => {
        addRow(tableName)
    }

    return (
        <div className="flex-1 overflow-auto">
            <Table>
                <TableHeader className="bg-muted/50 sticky top-0">
                    <TableRow>
                        <TableHead className="w-[40px]">
                            <Checkbox
                                checked={selectedRows.length === tableData.rows.length && tableData.rows.length > 0}
                                onCheckedChange={toggleAllRows}
                            />
                        </TableHead>
                        {tableData.columns.map((column) => (
                            <TableHead key={column} className="min-w-[150px]">
                                <div className="flex items-center gap-2">
                                    {column}
                                    <span className="text-xs text-muted-foreground">uuid</span>
                                </div>
                            </TableHead>
                        ))}
                        <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tableData.rows.map((row) => (
                        <TableRow key={row.id} className={selectedRows.includes(row.id) ? "bg-muted/30" : ""}>
                            <TableCell>
                                <Checkbox checked={selectedRows.includes(row.id)} onCheckedChange={() => toggleRow(row.id)} />
                            </TableCell>
                            {tableData.columns.map((column) => (
                                <TableCell key={`${row.id}-${column}`} className="font-mono text-sm">
                                    <div className="flex items-center justify-between group">
                                        <div className="truncate max-w-[300px]">{row[column]}</div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 opacity-0 group-hover:opacity-100"
                                            onClick={() => handleCellEdit(row.id, column, row[column])}
                                        >
                                            <Edit className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </TableCell>
                            ))}
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleDeleteRow(row.id)}>
                                            <Trash className="mr-2 h-4 w-4" />
                                            Delete row
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Copy className="mr-2 h-4 w-4" />
                                            Copy row ID
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex items-center justify-between border-t p-4">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleAddNewRow}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add row
                    </Button>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Button variant="ghost" size="sm">
                        <ChevronRight className="mr-2 h-4 w-4" />
                        Page
                    </Button>
                    <div className="flex items-center border rounded-md overflow-hidden">
                        <Input type="number" className="w-16 h-8 border-0" defaultValue="1" />
                    </div>
                    <span>of 4</span>
                    <span className="mx-2">•</span>
                    <span>100 rows</span>
                    <span className="mx-2">•</span>
                    <span>369 records</span>
                    <Button variant="ghost" size="sm" className="ml-2">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh
                    </Button>
                </div>
            </div>
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
