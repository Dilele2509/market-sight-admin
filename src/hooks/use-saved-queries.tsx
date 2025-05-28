"use client"

import { useState } from "react"

export interface SavedQuery {
    id: string
    name: string
    query: string
    isFavorite: boolean
    type: "private" | "shared" | "favorite"
}

// Initial sample queries
const initialQueries: SavedQuery[] = [
    {
        id: "1",
        name: "Retrieve Segment ID Column Info",
        query: "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'segments'",
        isFavorite: false,
        type: "private",
    },
    {
        id: "2",
        name: "Fetch a single customer record",
        query: "SELECT * FROM customers WHERE id = '66fccc2a-7ca5-49e7-8e52-0c532c3382e9' LIMIT 1",
        isFavorite: false,
        type: "private",
    },
    {
        id: "3",
        name: "Count transactions by date",
        query:
            "SELECT DATE(created_at) as date, COUNT(*) as count FROM transactions GROUP BY DATE(created_at) ORDER BY date DESC",
        isFavorite: true,
        type: "favorite",
    },
    {
        id: "4",
        name: "Top customers by revenue",
        query:
            "SELECT c.name, SUM(t.amount) as total_revenue FROM transactions t JOIN customers c ON t.customer_id = c.id GROUP BY c.id, c.name ORDER BY total_revenue DESC LIMIT 10",
        isFavorite: true,
        type: "favorite",
    },
    {
        id: "5",
        name: "Team sales dashboard query",
        query:
            "SELECT p.name as product, SUM(t.quantity) as units_sold, SUM(t.quantity * p.price) as revenue FROM transactions t JOIN products p ON t.product_id = p.id WHERE t.created_at > NOW() - INTERVAL '30 days' GROUP BY p.id, p.name ORDER BY revenue DESC",
        isFavorite: false,
        type: "shared",
    },
]

export function useSavedQueries() {
    const [savedQueries, setSavedQueries] = useState<SavedQuery[]>(initialQueries)

    // Add a new query
    const addQuery = (query: SavedQuery) => {
        setSavedQueries((prev) => [...prev, query])
    }

    // Toggle favorite status
    const toggleFavorite = (id: string) => {
        setSavedQueries((prev) =>
            prev.map((query) =>
                query.id === id
                    ? {
                        ...query,
                        isFavorite: !query.isFavorite,
                        type: !query.isFavorite ? "favorite" : query.type === "favorite" ? "private" : query.type,
                    }
                    : query,
            ),
        )
    }

    // Delete a query
    const deleteQuery = (id: string) => {
        setSavedQueries((prev) => prev.filter((query) => query.id !== id))
    }

    // Update a query
    const updateQuery = (id: string, updates: Partial<SavedQuery>) => {
        setSavedQueries((prev) => prev.map((query) => (query.id === id ? { ...query, ...updates } : query)))
    }

    // Filter queries by type
    const favoriteQueries = savedQueries.filter((q) => q.isFavorite)
    const privateQueries = savedQueries.filter((q) => q.type === "private")
    const sharedQueries = savedQueries.filter((q) => q.type === "shared")

    return {
        savedQueries,
        addQuery,
        toggleFavorite,
        deleteQuery,
        updateQuery,
        favoriteQueries,
        privateQueries,
        sharedQueries,
    }
}
