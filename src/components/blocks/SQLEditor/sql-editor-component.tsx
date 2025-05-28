"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, ChevronRight, Database, Search, Star, StarOff } from "lucide-react"
import dynamic from "next/dynamic"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useSavedQueries } from "@/hooks/use-saved-queries"

// Dynamically import Monaco Editor with no SSR
const MonacoEditor = dynamic(() => import("@monaco-editor/react").then((mod) => mod.Editor), { ssr: false })

export function SqlEditor() {
    const [query, setQuery] = useState<string>("select customer_id from customers where business_id = 1")
    const [queryResults, setQueryResults] = useState<any[] | null>(null)
    const [isExecuting, setIsExecuting] = useState(false)
    const [activeTab, setActiveTab] = useState("results")
    const [newQueryName, setNewQueryName] = useState("")
    const [saveDialogOpen, setSaveDialogOpen] = useState(false)
    const editorRef = useRef<any>(null)

    const [sidebarWidth, setSidebarWidth] = useState(256) // 256px = w-64
    const [isResizingSidebar, setIsResizingSidebar] = useState(false)
    const [startSidebarX, setStartSidebarX] = useState(0)
    const [startSidebarWidth, setStartSidebarWidth] = useState(256)

    const { savedQueries, addQuery, toggleFavorite, favoriteQueries, privateQueries, sharedQueries } = useSavedQueries()

    const [editorHeight, setEditorHeight] = useState("400px")
    const [isDragging, setIsDragging] = useState(false)
    const [startY, setStartY] = useState(0)
    const [startHeight, setStartHeight] = useState(0)

    const handleSidebarResizeStart = (e: React.MouseEvent) => {
        setIsResizingSidebar(true)
        setStartSidebarX(e.clientX)
        setStartSidebarWidth(sidebarWidth)

        document.addEventListener("mousemove", handleSidebarResizeMove)
        document.addEventListener("mouseup", handleSidebarResizeEnd)
    }

    const handleSidebarResizeMove = (e: MouseEvent) => {
        if (!isResizingSidebar) return
        const deltaX = e.clientX - startSidebarX
        const newWidth = Math.max(180, startSidebarWidth + deltaX) // Giới hạn tối thiểu
        setSidebarWidth(newWidth)
    }

    const handleSidebarResizeEnd = () => {
        setIsResizingSidebar(false)
        document.removeEventListener("mousemove", handleSidebarResizeMove)
        document.removeEventListener("mouseup", handleSidebarResizeEnd)
    }


    const handleResizeStart = (e: React.MouseEvent) => {
        setIsDragging(true)
        setStartY(e.clientY)
        setStartHeight(Number.parseInt(editorHeight))

        // Add event listeners for mouse move and up
        document.addEventListener("mousemove", handleResizeMove)
        document.addEventListener("mouseup", handleResizeEnd)
    }

    const handleResizeMove = (e: MouseEvent) => {
        if (!isDragging) return

        const deltaY = e.clientY - startY
        const newHeight = Math.max(100, startHeight + deltaY) // Minimum height of 100px
        setEditorHeight(`${newHeight}px`)
    }

    const handleResizeEnd = () => {
        setIsDragging(false)

        // Remove event listeners
        document.removeEventListener("mousemove", handleResizeMove)
        document.removeEventListener("mouseup", handleResizeEnd)
    }

    // Clean up event listeners when component unmounts
    useEffect(() => {
        return () => {
            document.removeEventListener("mousemove", handleResizeMove)
            document.removeEventListener("mouseup", handleResizeEnd)
        }
    }, [isDragging])

    const handleEditorDidMount = (editor: any) => {
        editorRef.current = editor
    }

    const executeQuery = () => {
        setIsExecuting(true)

        // Mock execution - in a real app, this would call an API
        setTimeout(() => {
            // Generate mock results
            const mockResults = Array(8)
                .fill(null)
                .map((_, i) => ({
                    customer_id: `a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a${i + 10}`,
                }))

            setQueryResults(mockResults)
            setIsExecuting(false)
            setActiveTab("results")
        }, 500)
    }

    const handleSaveQuery = () => {
        if (newQueryName.trim()) {
            addQuery({
                id: Date.now().toString(),
                name: newQueryName,
                query: query,
                isFavorite: false,
                type: "private",
            })
            setNewQueryName("")
            setSaveDialogOpen(false)
        }
    }

    return (
        <div className="flex h-screen w-full overflow-hidden bg-card">
            {/* Sidebar */}
            <div style={{ width: sidebarWidth }} className="border-r bg-muted/20 flex flex-col relative">
                <div
                    onMouseDown={handleSidebarResizeStart}
                    className="absolute top-0 right-0 w-2 cursor-ew-resize h-full group"
                >
                    <div className="w-1 h-full mx-auto bg-muted/50 group-hover:bg-muted transition-colors" />
                </div>
                <div className="p-4 border-b">
                    <h1 className="text-xl font-bold">SQL Editor</h1>
                </div>
                <div className="p-4 border-b">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="search" placeholder="Search queries..." className="pl-8" />
                    </div>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-2">
                        <div className="mb-4">
                            <h2 className="px-2 text-lg font-semibold">Templates</h2>
                            <div className="mt-1">
                                <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-left hover:bg-muted">
                                    Quickstarts
                                </button>
                            </div>
                        </div>

                        <div className="mb-4">
                            <button className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm text-left hover:bg-muted">
                                <div className="flex items-center gap-2">
                                    <ChevronDown className="h-4 w-4" />
                                    <span>SAVED ({privateQueries.length})</span>
                                </div>
                            </button>
                            <div className="mt-1 pl-4">
                                {privateQueries.map((query) => (
                                    <button
                                        key={query.id}
                                        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-left hover:bg-muted"
                                        onClick={() => setQuery(query.query)}
                                    >
                                        <Database className="h-4 w-4 text-muted-foreground" />
                                        <span className="flex-1 truncate">{query.name}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:opacity-100"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                toggleFavorite(query.id)
                                            }}
                                        >
                                            {query.isFavorite ? (
                                                <Star className="h-3.5 w-3.5 fill-current" />
                                            ) : (
                                                <StarOff className="h-3.5 w-3.5" />
                                            )}
                                        </Button>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Editor with resizable handle */}
                <div className="border-b" style={{ height: editorHeight }}>
                    <div className="relative h-full">
                        <MonacoEditor
                            height="100%"
                            defaultLanguage="sql"
                            defaultValue={query}
                            onChange={(value) => setQuery(value || "")}
                            onMount={handleEditorDidMount}
                            theme="hc-black"
                            options={{
                                minimap: { enabled: false },
                                lineNumbers: "on",
                                fontSize: 14,
                                scrollBeyondLastLine: false,
                            }}
                            loading={<div className="p-4 text-center">Loading editor...</div>}
                        />
                        <div className="absolute bottom-4 right-4 flex gap-2">
                            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        Save
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Save Query</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="query-name">Query Name</Label>
                                            <Input
                                                id="query-name"
                                                value={newQueryName}
                                                onChange={(e) => setNewQueryName(e.target.value)}
                                                placeholder="Enter a name for your query"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleSaveQuery}>Save Query</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <Button onClick={executeQuery} disabled={isExecuting}>
                                {isExecuting ? "Running..." : "Run"}
                            </Button>
                        </div>
                    </div>
                    <div
                        className="h-3 cursor-ns-resize group relative"
                        onMouseDown={handleResizeStart}
                    >
                        <div className="absolute inset-0 bg-muted/30 group-hover:bg-muted transition-colors" />
                        <div className="relative z-10 flex justify-center items-center h-full">
                            <div className="w-8 h-1.5 bg-muted-foreground/70 rounded-full shadow" />
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="flex-1 overflow-hidden">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                        <div className="border-b px-4">
                            <TabsList>
                                <TabsTrigger value="results">Results</TabsTrigger>
                                <TabsTrigger value="chart">Chart</TabsTrigger>
                                <TabsTrigger value="export">Export</TabsTrigger>
                            </TabsList>
                        </div>
                        <TabsContent value="results" className="flex-1 overflow-auto p-0">
                            {queryResults ? (
                                <div className="h-full flex flex-col">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                {Object.keys(queryResults[0] || {}).map((key) => (
                                                    <TableHead key={key}>{key}</TableHead>
                                                ))}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {queryResults.map((row, i) => (
                                                <TableRow key={i}>
                                                    {Object.values(row).map((value, j) => (
                                                        <TableCell key={j} className="font-mono">
                                                            {value as string}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    <div className="mt-auto border-t p-2 text-sm text-muted-foreground">{queryResults.length} rows</div>
                                </div>
                            ) : (
                                <div className="flex h-full items-center justify-center">
                                    <p className="text-muted-foreground">Run a query to see results</p>
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent value="chart" className="flex-1 p-4">
                            <div className="flex h-full items-center justify-center">
                                <p className="text-muted-foreground">Chart visualization would appear here</p>
                            </div>
                        </TabsContent>
                        <TabsContent value="export" className="flex-1 p-4">
                            <div className="flex h-full items-center justify-center">
                                <p className="text-muted-foreground">Export options would appear here</p>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
