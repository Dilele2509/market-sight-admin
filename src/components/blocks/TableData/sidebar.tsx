"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TableType } from "@/types/table"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    selectedTable: TableType
    onTableSelect: (table: TableType) => void
}

const TABLE_OPTIONS = [
    {
        id: "customers" as TableType,
        name: "Customers"
    },
    {
        id: "transactions" as TableType,
        name: "Transactions"
    },
    {
        id: "stores" as TableType,
        name: "Stores"
    },
    {
        id: "product_lines" as TableType,
        name: "Product Lines"
    }
]

export function Sidebar({ className, selectedTable, onTableSelect }: SidebarProps) {
    return (
        <Card className={cn("w-64", className)}>
            <div className="p-4">
                <h2 className="mb-4 text-lg font-semibold tracking-tight">
                    Tables
                </h2>
                <div className="space-y-1">
                    {TABLE_OPTIONS.map((table) => (
                        <Button
                            key={table.id}
                            variant={selectedTable === table.id ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => onTableSelect(table.id)}
                        >
                            {table.name}
                        </Button>
                    ))}
                </div>
            </div>
        </Card>
    )
}
