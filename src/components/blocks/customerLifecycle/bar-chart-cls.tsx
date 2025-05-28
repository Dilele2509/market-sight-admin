"use client"

import { Bar, BarChart, XAxis, YAxis, Legend } from "recharts"
import { type ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { CLSList } from "@/types/lifecycleTypes"
import { useEffect, useState } from "react"

interface BarChartCLSProps {
    data: CLSList
}

const chartConfig = {
    GMV_normalized: {
        label: "GMV",
        color: "hsl(var(--chart-1))",
    },
    AOV_normalized: {
        label: "AOV",
        color: "hsl(var(--chart-2))",
    },
    ARPU_normalized: {
        label: "ARPU",
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig

// Custom tooltip to show original values
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const original = payload[0].payload.original;

        return (
            <div className="rounded-lg border bg-background p-2 shadow-sm">
                <div className="space-y-1">
                    <div className="font-semibold">{label}</div>
                    <div className="text-sm">
                        <div>GMV: ${original.GMV.toFixed(2)}</div>
                        <div>AOV: {original.AOV.toFixed(2)}</div>
                        <div>ARPU: {original.ARPU.toFixed(2)}</div>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

export function BarChartCLS({ data }: BarChartCLSProps) {
    const [originalData, setOriginalData] = useState([])

    useEffect(() => {
        setOriginalData(formatData(data));
    }, [data])

    // Find maximum values for each metric
    const maxGMV = Math.max(...originalData.map((item) => item.GMV))
    const maxAOV = Math.max(...originalData.map((item) => item.AOV))
    const maxARPU = Math.max(...originalData.map((item) => item.ARPU))

    // Normalize data (0-100 scale)
    const chartData = originalData.map((item) => ({
        segment: item.segment,
        GMV: item.GMV,
        AOV: item.AOV,
        ARPU: item.ARPU,
        // Normalized values for display
        GMV_normalized: Math.round((item.GMV / maxGMV) * 100),
        AOV_normalized: Math.round((item.AOV / maxAOV) * 100),
        ARPU_normalized: Math.round((item.ARPU / maxARPU) * 100),
        // Store original values for tooltip
        original: {
            GMV: item.GMV,
            AOV: item.AOV,
            ARPU: item.ARPU,
        },
    }))
    const formatData = (data: CLSList) => {
        const rawData = data ?? {}
        const order = ["New", "Early", "Mature", "Loyal"]

        const formattedData = Object.entries(rawData)
            .map(([key, value]) => ({
                segment: key.charAt(0).toUpperCase() + key.slice(1),
                GMV: value?.aggregated_metrics?.gmv,
                AOV: value?.aggregated_metrics?.aov,
                ARPU: value?.aggregated_metrics?.arpu
            }))
            .sort((a, b) => order.indexOf(a.segment) - order.indexOf(b.segment))

        return formattedData;
    }

    return (
        <ChartContainer config={chartConfig} className="min-h-full w-full">
            <BarChart
                data={chartData}
                layout="vertical"
                barSize={16}
                barCategoryGap={20}
            >
                <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                <YAxis dataKey="segment" type="category" tickLine={false} tickMargin={10} axisLine={false} />
                <ChartTooltip cursor={false} content={<CustomTooltip />} />
                <Bar dataKey="GMV_normalized" name="GMV" fill="var(--color-GMV_normalized)" radius={5} />
                <Bar dataKey="AOV_normalized" name="AOV" fill="var(--color-AOV_normalized)" radius={5} />
                <Bar dataKey="ARPU_normalized" name="ARPU" fill="var(--color-ARPU_normalized)" radius={5} />
                <Legend />
            </BarChart>
        </ChartContainer>
    )
}
