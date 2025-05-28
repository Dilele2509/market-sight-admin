"use client"

import { useState } from "react"
import { v4 as uuidv4 } from "uuid"

// Mock data structure
interface TableRow {
    id: string
    [key: string]: string
}

interface TableData {
    columns: string[]
    rows: TableRow[]
}

interface Tables {
    [tableName: string]: TableData
}

// Generate a random UUID
const generateUuid = () => {
    return uuidv4()
}

// Generate a random date in the last 3 years
const generateRandomDate = () => {
    const now = new Date()
    const threeYearsAgo = new Date()
    threeYearsAgo.setFullYear(now.getFullYear() - 3)

    const randomTimestamp = threeYearsAgo.getTime() + Math.random() * (now.getTime() - threeYearsAgo.getTime())
    const randomDate = new Date(randomTimestamp)

    return randomDate.toISOString().split("T")[0] + " " + randomDate.toTimeString().split(" ")[0].substring(0, 5)
}

// Initial mock data
const initialTables: Tables = {
    business: {
        columns: ["id", "name", "created_at"],
        rows: Array(5)
            .fill(null)
            .map(() => ({
                id: generateUuid(),
                name: `Business ${Math.floor(Math.random() * 1000)}`,
                created_at: generateRandomDate(),
            })),
    },
    customers: {
        columns: ["id", "name", "email", "created_at"],
        rows: Array(8)
            .fill(null)
            .map(() => ({
                id: generateUuid(),
                name: `Customer ${Math.floor(Math.random() * 1000)}`,
                email: `customer${Math.floor(Math.random() * 1000)}@example.com`,
                created_at: generateRandomDate(),
            })),
    },
    transactions: {
        columns: ["transaction_id", "customer_id", "store_id", "product_line_id", "transaction_date"],
        rows: Array(10)
            .fill(null)
            .map(() => ({
                id: generateUuid(),
                transaction_id: generateUuid(),
                customer_id: generateUuid(),
                store_id: generateUuid(),
                product_line_id: generateUuid(),
                transaction_date: generateRandomDate(),
            })),
    },
}

export function useTableData() {
    const [tables, setTables] = useState<Tables>(initialTables)
    const [currentTable, setCurrentTable] = useState<string | null>(null)

    // Get table data
    const getTableData = (tableName: string): TableData => {
        return tables[tableName] || { columns: [], rows: [] }
    }

    // Add a new table
    const addTable = (tableName: string) => {
        if (!tables[tableName]) {
            setTables((prev) => ({
                ...prev,
                [tableName]: {
                    columns: ["id", "name", "created_at"],
                    rows: [] as TableRow[], // Explicitly type as TableRow[]
                },
            }))
            setCurrentTable(tableName)
        }
    }

    // Add a new column
    const addColumn = (tableName: string, columnName: string) => {
        setTables((prev) => {
            const table = prev[tableName]
            if (!table) return prev

            // Add the column if it doesn't exist
            if (!table.columns.includes(columnName)) {
                const updatedRows = table.rows.map((row) => ({
                    ...row,
                    [columnName]: generateUuid(), // Default value for new column
                }))

                return {
                    ...prev,
                    [tableName]: {
                        columns: [...table.columns, columnName],
                        rows: updatedRows,
                    },
                }
            }

            return prev
        })
    }

    // Delete a column
    const deleteColumn = (tableName: string, columnName: string) => {
        // setTables((prev) => {
        //     const table = prev[tableName]
        //     if (!table || !table.columns.includes(columnName) || columnName === "id") return prev

        //     const updatedColumns = table.columns.filter((col) => col !== columnName)
        //     const updatedRows = table.rows.map((row) => {
        //         const { [columnName]: _, ...rest } = row
        //         return rest
        //     })

        //     return {
        //         ...prev,
        //         [tableName]: {
        //             columns: updatedColumns,
        //             rows: updatedRows,
        //         },
        //     }
        // })
    }

    // Add a new row
    const addRow = (tableName: string) => {
        setTables((prev) => {
            const table = prev[tableName]
            if (!table) return prev

            const newRow: TableRow = { id: generateUuid() }
            table.columns.forEach((column) => {
                if (column !== "id") {
                    newRow[column] = generateUuid()
                }
            })

            return {
                ...prev,
                [tableName]: {
                    ...table,
                    rows: [...table.rows, newRow],
                },
            }
        })
    }

    // Delete a row
    const deleteRow = (tableName: string, rowId: string) => {
        setTables((prev) => {
            const table = prev[tableName]
            if (!table) return prev

            return {
                ...prev,
                [tableName]: {
                    ...table,
                    rows: table.rows.filter((row) => row.id !== rowId),
                },
            }
        })
    }

    // Update a cell
    const updateCell = (tableName: string, rowId: string, column: string, value: string) => {
        setTables((prev) => {
            const table = prev[tableName]
            if (!table) return prev

            const updatedRows = table.rows.map((row) => {
                if (row.id === rowId) {
                    return {
                        ...row,
                        [column]: value,
                    }
                }
                return row
            })

            return {
                ...prev,
                [tableName]: {
                    ...table,
                    rows: updatedRows,
                },
            }
        })
    }

    return {
        tables: Object.keys(tables).map((name) => ({
            name,
            locked: name === "transactions" || name === "stores",
        })),
        currentTable,
        setCurrentTable,
        getTableData,
        addTable,
        addColumn,
        deleteColumn,
        addRow,
        deleteRow,
        updateCell,
    }
}
