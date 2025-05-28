"use client"

import { useState } from "react"
import { ChevronDown, Database, Lock, Plus, Search } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface SidebarProps {
    tables: { name: string; locked?: boolean }[]
    selectedTable: string | null
    onSelectTable: (tableName: string) => void
    onAddTable: (tableName: string) => void
}

export function Sidebar({ tables, selectedTable, onSelectTable, onAddTable }: SidebarProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [newTableName, setNewTableName] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const filteredTables = tables.filter((table) => table.name.toLowerCase().includes(searchQuery.toLowerCase()))

    const handleAddTable = () => {
        if (newTableName.trim()) {
            onAddTable(newTableName.trim())
            setNewTableName("")
            setIsDialogOpen(false)
        }
    }

    return (
        <div className="w-64 border-r bg-muted/20 flex flex-col">
            <div className="p-4 border-b">
                <div className="flex items-center gap-2 mb-4">
                    <div className="bg-muted rounded px-2 py-1 text-xs">schema</div>
                    <div className="flex-1">public</div>
                    <ChevronDown className="h-4 w-4" />
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                            <Plus className="mr-2 h-4 w-4" />
                            New table
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create new table</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Table name</Label>
                                <Input
                                    id="name"
                                    value={newTableName}
                                    onChange={(e) => setNewTableName(e.target.value)}
                                    placeholder="Enter table name"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleAddTable}>Create table</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="p-4 border-b">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search tables..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <ScrollArea className="flex-1">
                <div className="p-2">
                    {filteredTables.map((table) => (
                        <button
                            key={table.name}
                            className={cn(
                                "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-left",
                                selectedTable === table.name ? "bg-accent text-accent-foreground" : "hover:bg-muted",
                            )}
                            onClick={() => onSelectTable(table.name)}
                        >
                            <Database className="h-4 w-4" />
                            <span className="flex-1 truncate">{table.name}</span>
                            {table.locked && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
                        </button>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}
