import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CLSItem, CLSList, Customer } from "@/types/lifecycleTypes"

interface CustomerMetricsTableProps {
    tableData: CLSList
}

export function CustomerMetricsTable({ tableData }: CustomerMetricsTableProps) {
    const [openStage, setOpenStage] = useState<string | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [openData, setOpenData] = useState<CLSItem>()

    const stages = ['new', 'early', 'mature', 'loyal']
    function formatValue(val: any) {
        if (typeof val === "number") return Number.isInteger(val) ? val : val.toFixed(2)
        if (typeof val === "boolean") return val ? "Yes" : "No"
        if (val === null || val === undefined) return "-"
        return val
    }


    const handleOpenDialog = (stage: string) => {
        setOpenStage(stage)
        setOpenData(tableData[stage])
        setDialogOpen(true)
    }

    const calculateTotals = (data: Record<string, any>) => {
        const totals = {
            gmv: 0, orders: 0, unique_customers: 0, aov: 0,
            avg_bill_per_user: 0, arpu: 0, orders_per_day: 0,
            orders_per_day_per_store: 0
        }

        let count = 0
        for (const key in data) {
            const metrics = data[key].aggregated_metrics
            totals.gmv += metrics.gmv || 0
            totals.orders += metrics.orders || 0
            totals.unique_customers += metrics.unique_customers || 0
            totals.aov += metrics.aov || 0
            totals.avg_bill_per_user += metrics.avg_bill_per_user || 0
            totals.arpu += metrics.arpu || 0
            totals.orders_per_day += metrics.orders_per_day || 0
            totals.orders_per_day_per_store += metrics.orders_per_day_per_store || 0
            count++
        }

        totals.aov /= count
        totals.avg_bill_per_user /= count
        totals.arpu /= count
        totals.orders_per_day /= count
        totals.orders_per_day_per_store /= count

        return totals
    }

    const totals = calculateTotals(tableData)

    const selectedCustomers = openStage ? tableData[openStage]?.customers || [] : []

    useEffect(() => {
        console.log(tableData['new']?.customers);
        //formatCustomerData(tableData['new']?.customers)
    }, [tableData])

    return (
        <>
            <div className="overflow-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[180px]">Lifecycle Stage</TableHead>
                            <TableHead>GMV</TableHead>
                            <TableHead>Orders</TableHead>
                            <TableHead>Unique Customers</TableHead>
                            <TableHead>AOV</TableHead>
                            <TableHead>Avg Bill/User</TableHead>
                            <TableHead>ARPU</TableHead>
                            <TableHead>Orders/Day</TableHead>
                            <TableHead>Orders/Day/Store</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {stages.map((stageKey) => {
                            const stageData = tableData[stageKey]
                            const metrics = stageData?.aggregated_metrics || {}

                            return (
                                <TableRow key={stageKey} className="cursor-pointer hover:bg-primary" onClick={() => handleOpenDialog(stageKey)}>
                                    <TableCell className="font-medium">{stageData?.name || '-'}</TableCell>
                                    <TableCell>${metrics.gmv?.toLocaleString() || '0'}</TableCell>
                                    <TableCell>{metrics.orders?.toLocaleString() || '0'}</TableCell>
                                    <TableCell>{metrics.unique_customers?.toLocaleString() || '0'}</TableCell>
                                    <TableCell>${metrics.aov?.toFixed(2) || '0.00'}</TableCell>
                                    <TableCell>${metrics.avg_bill_per_user?.toFixed(2) || '0.00'}</TableCell>
                                    <TableCell>${metrics.arpu?.toFixed(2) || '0.00'}</TableCell>
                                    <TableCell>{metrics.orders_per_day?.toFixed(1) || '0.0'}</TableCell>
                                    <TableCell>{metrics.orders_per_day_per_store?.toFixed(1) || '0.0'}</TableCell>
                                </TableRow>
                            )
                        })}
                        <TableRow className="bg-muted/50">
                            <TableCell className="font-medium">Total</TableCell>
                            <TableCell className="font-medium">${totals.gmv.toLocaleString()}</TableCell>
                            <TableCell className="font-medium">{totals.orders.toLocaleString()}</TableCell>
                            <TableCell className="font-medium">{totals.unique_customers.toLocaleString()}</TableCell>
                            <TableCell className="font-medium">${totals.aov.toFixed(2)}</TableCell>
                            <TableCell className="font-medium">${totals.avg_bill_per_user.toFixed(2)}</TableCell>
                            <TableCell className="font-medium">${totals.arpu.toFixed(2)}</TableCell>
                            <TableCell className="font-medium">{totals.orders_per_day.toFixed(1)}</TableCell>
                            <TableCell className="font-medium">{totals.orders_per_day_per_store.toFixed(1)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[80vh]">
                    <DialogHeader>
                        <DialogTitle>Customer Details in {openStage}</DialogTitle>
                    </DialogHeader>

                    {openData?.customers?.length ? (
                        <div className="border rounded overflow-hidden">
                            <div className="overflow-x-auto">
                                <div className="overflow-y-auto max-h-[60vh]">
                                    <Table className="min-w-full Table-fixed">
                                        <TableHeader className="bg-gray-100 sticky top-0 z-10">
                                            <TableRow>
                                                {Object.keys(openData.customers[0]).map((key) => (
                                                    <TableHead
                                                        key={key}
                                                        className="text-left px-4 py-2 font-medium text-sm border-b"
                                                    >
                                                        {key
                                                            .replace(/_/g, " ")
                                                            .replace(/\b\w/g, (char) => char.toUpperCase())}
                                                    </TableHead>
                                                ))}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {openData.customers.map((customer, idx) => (
                                                <TableRow key={idx} className="even:bg-gray-50">
                                                    {Object.entries(customer).map(([key, value]) => (
                                                        <TableCell key={key} className="px-4 py-2 text-sm border-b min-w-[200px]">
                                                            {formatValue(value)}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-center text-sm text-gray-500">
                            No customer data available.
                        </p>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
