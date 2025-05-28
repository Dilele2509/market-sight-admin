"use client"

import { DashboardShell } from "@/components/layout/DashboardShell"
import { Card, CardContent } from "@/components/ui/card"
import dynamic from "next/dynamic"

// Dynamically import the SqlEditor component with no SSR
const SqlEditor = dynamic(() => import("../components/blocks/SQLEditor/sql-editor-component").then((mod) => mod.SqlEditor), {
    ssr: false,
})

export default function SqlEditorPage() {
    return (
        <DashboardShell>
            <Card>
                <CardContent>
                    <SqlEditor />
                </CardContent>
            </Card>
        </DashboardShell>
    )
}
