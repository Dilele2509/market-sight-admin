"use client"

import { useState } from "react"
import { Plus, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTableData } from "@/hooks/use-table-data" 

interface TableToolbarProps {
    tableName: string
}

export function TableToolbar({ tableName }: TableToolbarProps) {
    const { addColumn, deleteColumn } = useTableData()
    const [isAddColumnOpen, setIsAddColumnOpen] = useState(false)
    const [isDeleteColumnOpen, setIsDeleteColumnOpen] = useState(false)
    const [newColumnName, setNewColumnName] = useState("")
    const [columnToDelete, setColumnToDelete] = useState("")

    const handleAddColumn = () => {
        if (newColumnName.trim()) {
            addColumn(tableName, newColumnName.trim())
            setNewColumnName("")
            setIsAddColumnOpen(false)
        }
    }

    const handleDeleteColumn = () => {
        if (columnToDelete) {
            deleteColumn(tableName, columnToDelete)
            setColumnToDelete("")
            setIsDeleteColumnOpen(false)
        }
    }

    return (
        <div className="border-b p-2 flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsAddColumnOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add column
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsDeleteColumnOpen(true)}>
                <Trash className="mr-2 h-4 w-4" />
                Delete column
            </Button>

            <Dialog open={isAddColumnOpen} onOpenChange={setIsAddColumnOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add new column</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="column-name">Column name</Label>
                            <Input
                                id="column-name"
                                value={newColumnName}
                                onChange={(e) => setNewColumnName(e.target.value)}
                                placeholder="Enter column name"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleAddColumn}>Add column</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteColumnOpen} onOpenChange={setIsDeleteColumnOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete column</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="column-delete">Column name</Label>
                            <Input
                                id="column-delete"
                                value={columnToDelete}
                                onChange={(e) => setColumnToDelete(e.target.value)}
                                placeholder="Enter column name to delete"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="destructive" onClick={handleDeleteColumn}>
                            Delete column
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
