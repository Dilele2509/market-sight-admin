"use client"

import { useState } from "react"
import { Filter, Plus, SlidersHorizontal } from "lucide-react"

import { Button } from "../../ui/button" 
import { Sidebar } from "./sidebar"
import { TableView } from "./table-view"
import { TableToolbar } from "./table-toolbar"
import { useTableData } from "@/hooks/use-table-data"

export function TableEditor() {
    const [selectedTable, setSelectedTable] = useState<string | null>(null)
    const { tables, currentTable, setCurrentTable, addTable } = useTableData()

    const handleTableSelect = (tableName: string) => {
        setSelectedTable(tableName)
        setCurrentTable(tableName)
    }

    return (
        <div className="flex h-screen w-full mt-4 mb-4 overflow-hidden bg-card">
            <Sidebar tables={tables} onSelectTable={handleTableSelect} selectedTable={selectedTable} onAddTable={addTable} />
            <div className="flex flex-1 flex-col overflow-hidden">
                <div className="flex items-center justify-between border-b px-4 py-2">
                    <h1 className="text-xl font-bold">Table Editor</h1>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                            <Filter className="mr-2 h-4 w-4" />
                            Filter
                        </Button>
                        <Button variant="outline" size="sm">
                            <SlidersHorizontal className="mr-2 h-4 w-4" />
                            Sort
                        </Button>
                        <Button variant="default" size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Insert
                        </Button>
                    </div>
                </div>
                {currentTable ? (
                    <>
                        <TableToolbar tableName={currentTable} />
                        <TableView tableName={currentTable} />
                    </>
                ) : (
                    <div className="flex flex-1 items-center justify-center">
                        <div className="text-center">
                            <h2 className="text-lg font-medium">No table selected</h2>
                            <p className="text-muted-foreground">Select a table from the sidebar or create a new one</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
