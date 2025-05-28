import { DashboardShell } from "@/components/layout/DashboardShell"
import { TableEditor } from "@/components/blocks/TableData/table-editor"
import { Card, CardContent } from "@/components/ui/card"

export default function TableData() {
    return (
        <DashboardShell>
            <Card>
                <CardContent>
                    <TableEditor />
                </CardContent>
            </Card>
        </DashboardShell>
    )
}
