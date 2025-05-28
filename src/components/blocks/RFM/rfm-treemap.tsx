"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import ScoreBar from "./score-bar-rfm"
import { StrategyDialog } from "./strategyDialog"
import { translateSegmentName } from "@/utils/rfmFunctionHelper"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RFMInterface } from "@/pages/MicroSegmentation/RFM"
import { SyncSettingsDialog } from "./DialogChooseSegmentSynx"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

// Generate a color based on the name
const generateColor: Record<string, string> = {
    Champions: "#1D5C4D", // Dark Teal
    "Loyal Customers": "#4D8C8C", // Dark Turquoise
    "Potential Loyalist": "#6A9F86", // Dark Mint Green
    "New Customers": "#4A91D6", // Medium Sky Blue
    Promising: "#86C3E6", // Soft Ice Blue
    "Need Attention": "#EA8D00", // Warm Yellow-Orange
    "About To Sleep": "#5A8A9D", // Dusty Powder Blue
    "Can't Lose Them": "#FF9B4B", // Warm Orange
    "At Risk": "#F24A4A", // Soft Red
    Hibernating: "#4B8FB7", // Medium Powder Blue
    Lost: "#B85B5B", // Soft Red (for Lost, if you want to add color for Lost)
}

// Add this mapping of segments to their RFM values after the generateColor object
const segmentRfmValues: Record<string, { r: number; f: number; m: number }> = {
    Champions: { r: 5, f: 5, m: 5 },
    "Loyal Customers": { r: 3, f: 4, m: 5 },
    "Potential Loyalist": { r: 4, f: 2, m: 2 },
    "New Customers": { r: 5, f: 1, m: 1 },
    Promising: { r: 4, f: 1, m: 1 },
    "Need Attention": { r: 4, f: 4, m: 3 },
    "About To Sleep": { r: 3, f: 2, m: 2 },
    "At Risk": { r: 2, f: 4, m: 4 },
    "Can't Lose Them": { r: 1, f: 5, m: 5 },
    Hibernating: { r: 2, f: 2, m: 2 },
    Lost: { r: 1, f: 1, m: 1 },
}

// Define a type for the treemap node that includes the properties added by d3.treemap()
type TreemapNode = d3.HierarchyNode<any> & {
    x0: number
    y0: number
    x1: number
    y1: number
}

// Replace the interface RfmTreemapProps with this updated version
interface RfmTreemapProps {
    rawData: RFMInterface
    rfmData: {
        segment: string
        count: number
        percentage: number
    }[]
}

export function RfmTreemap({ rawData, rfmData }: RfmTreemapProps) {
    const svgRef = useRef<SVGSVGElement>(null)
    const tooltipRef = useRef<HTMLDivElement>(null)
    const [tab, setTab] = useState("R")
    const [isOpen, setIsOpen] = useState(false)
    const [selectSync, setSelectSync] = useState<string>(null)
    const [selectedSegment, setSelectedSegment] = useState<{
        name: string
        percentage: string
    } | null>(null)

    // Replace the formattedData transformation in the RfmTreemap component with this
    const formattedData = rfmData.map((item) => {
        const rfmValues = segmentRfmValues[item.segment] || { r: 3, f: 3, m: 3 }
        return {
            name: item.segment,
            value: item.count,
            percentage: item.percentage + "%",
            r: rfmValues.r,
            f: rfmValues.f,
            m: rfmValues.m,
        }
    })

    const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({})

    useEffect(() => {
        const initialValues: Record<string, number> = {}
        formattedData.forEach((segment) => {
            initialValues[segment.name] = 0
        })
        setAnimatedValues(initialValues)

        // Bắt đầu animate
        const duration = 1000
        const start = Date.now()

        const timer = d3.timer(() => {
            const elapsed = Date.now() - start
            const t = Math.min(1, elapsed / duration) // 0 -> 1

            const newValues: Record<string, number> = {}
            formattedData.forEach((segment) => {
                newValues[segment.name] = Math.floor(d3.interpolateNumber(0, segment.value)(t))
            })
            setAnimatedValues(newValues)

            if (t === 1) {
                timer.stop()
            }
        })

        return () => timer.stop()
    }, [])

    //generate tree map
    useEffect(() => {
        if (!svgRef.current) return

        const width = svgRef.current.clientWidth
        const height = 500

        // Clear previous content
        d3.select(svgRef.current).selectAll("*").remove()

        const margin = { top: 0, right: 0, bottom: 50, left: 70 }

        const svg = d3
            .select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width - margin.left, height + margin.bottom])
            .style("font", "10px sans-serif")

        // Create hierarchy
        const root = d3.hierarchy({ children: formattedData }).sum((d) => (d as any).value)

        // Create treemap layout
        const treemap = d3.treemap().size([width, height]).paddingOuter(3).paddingInner(1)

        treemap(root)

        // Create tooltip
        const tooltip = d3
            .select(tooltipRef.current)
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background-color", "hsl(var(--background))")
            .style("border", "1px solid #ddd")
            .style("border-radius", "4px")
            .style("padding", "10px")
            .style("box-shadow", "0 2px 10px rgba(0, 0, 0, 0.1)")
            .style("pointer-events", "none")
            .style("z-index", "10")

        // Create cells
        const cell = svg
            .selectAll<SVGGElement, TreemapNode>("g")
            .data(root.leaves() as TreemapNode[])
            .join("g")
            .attr("transform", (d) => `translate(${(d.x0 + d.x1) / 2}, ${(d.y0 + d.y1) / 2})`)
            .style("opacity", 0) // Bắt đầu ẩn

        cell
            .transition()
            .delay((_, i) => i * 40 + Math.random() * 150)
            .duration(600)
            .ease(d3.easeBackOut.overshoot(1.5))
            .attr("transform", (d) => `translate(${d.x0},${d.y0})`)
            .style("opacity", 1) // Fade in

        // Add rectangles
        cell
            .append("rect")
            .attr("width", 0)
            .attr("height", 0)
            .attr("fill", (d) => generateColor[(d.data as any).name])
            .on("mouseover", (event, d) => {
                tooltip.style("visibility", "visible").html(`
                    <div class="font-medium">${translateSegmentName((d.data as any).name)}</div>
                    <div>Số lượng khách hàng: ${(d.data as any).value.toLocaleString()}</div>
                    <div>Tỉ trọng: ${(d.data as any).percentage}</div>
                    <div>R: ${(d.data as any).r}, F: ${(d.data as any).f}, M: ${(d.data as any).m}</div>
                  `)

                // Position tooltip
                const tooltipWidth = tooltipRef.current?.offsetWidth || 0
                const tooltipHeight = tooltipRef.current?.offsetHeight || 0
                const x = event.pageX + 10
                const y = event.pageY - tooltipHeight - 10

                tooltip.style("left", `${x}px`).style("top", `${y}px`)
            })
            .on("mousemove", (event) => {
                const tooltipWidth = tooltipRef.current?.offsetWidth || 0
                const x = event.pageX + 10
                const y = event.pageY - (tooltipRef.current?.offsetHeight || 0) - 10

                tooltip.style("left", `${x}px`).style("top", `${y}px`)
            })
            .on("mouseout", () => {
                tooltip.style("visibility", "hidden")
            })
            .on("click", (event, d) => {
                setSelectedSegment({ name: d.data.name, percentage: d.data.percentage })
            })
            .style("cursor", "pointer")
            .transition()
            .duration(800)
            .ease(d3.easeCubicOut)
            .attr("width", (d) => d.x1 - d.x0)
            .attr("height", (d) => d.y1 - d.y0)

        // Add text - percentage
        cell
            .append("text")
            .attr("x", 4)
            .attr("y", 17)
            .attr("fill", "white")
            .attr("font-weight", "bold")
            .attr("font-size", "16px")
            .text((d) => (d.data as any).percentage)

        // Add text - value
        cell
            .append("text")
            .attr("x", 4)
            .attr("y", 35)
            .attr("fill", "white")
            .attr("font-size", "12px")
            .text((d) => (d.data as any).value.toLocaleString())

        // Add text - name (only for larger cells)
        cell
            .filter((d: TreemapNode) => d.x1 - d.x0 > 100 && d.y1 - d.y0 > 50)
            .append("text")
            .attr("x", 4)
            .attr("y", 55)
            .attr("fill", "white")
            .attr("font-size", "12px")
            .text((d) => translateSegmentName((d.data as any).name))

        // Add axes labels
        svg
            .append("text")
            .attr("x", width / 2)
            .attr("y", height + 45)
            .attr("text-anchor", "middle")
            .attr("fill", "hsl(var(--foreground))")
            .attr("font-size", "14px")
            .text("Recency (ngày)")

        svg
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -45)
            .attr("text-anchor", "middle")
            .attr("fill", "hsl(var(--foreground))")
            .attr("font-size", "14px")
            .text("Frequency + Monetary (số đơn + doanh thu)")

        // Add axis numbers
        for (let i = 1; i <= 5; i++) {
            svg
                .append("text")
                .attr("x", (width / 5) * i - width / 10)
                .attr("y", height + 20)
                .attr("text-anchor", "middle")
                .attr("fill", "hsl(var(--foreground))")
                .attr("font-size", "14px")
                .text(i.toString())
        }

        for (let i = 1; i <= 5; i++) {
            svg
                .append("text")
                .attr("x", -20)
                .attr("y", (height / 5) * (5 - i) + height / 10)
                .attr("text-anchor", "middle")
                .attr("fill", "hsl(var(--foreground))")
                .attr("font-size", "14px")
                .text(i.toString())
        }
    }, [])

    return (
        <div>
            <div className="grid grid-cols-11 w-full gap-3">
                {/* SVG section */}
                <div className="col-span-5">
                    <svg ref={svgRef} className="w-full" />
                    <div ref={tooltipRef} className="tooltip"></div>
                </div>

                {/* Segment Data - Name and Value */}
                <div className="col-span-3 gap-4 p-2">
                    <div className="flex justify-end mb-4">
                        <div className="text-sm font-medium">Số lượng khách hàng</div>
                    </div>
                    <div className="flex flex-col">
                        {formattedData.map((segment) => {
                            const hasCustomers = segment.value > 0;
                            const segmentName = translateSegmentName(segment.name);
                            const customerCount = animatedValues[segment.name]?.toLocaleString() ?? 0;

                            return (
                                <div
                                    key={segment.name}
                                    className="group relative overflow-hidden rounded-md cursor-pointer hover:bg-primary-light text-card-foreground"
                                >
                                    <div
                                        className={`flex items-center justify-between p-2 transition-transform duration-200 ease-in-out ${hasCustomers ? 'group-hover:-translate-x-28' : ''
                                            }`}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <div
                                                className="w-4 h-4"
                                                style={{ backgroundColor: generateColor[segment.name] }}
                                            ></div>
                                            <div className="text-sm">{segmentName}</div>
                                        </div>
                                        <div className="text-sm">{customerCount}</div>
                                    </div>

                                    {hasCustomers ? (
                                        // Nút đồng bộ nếu có khách hàng
                                        <div className="absolute right-1 top-0 h-full flex items-center justify-center transition-opacity duration-200 opacity-0 group-hover:opacity-100">
                                            <Button
                                                variant="ghost"
                                                className="h-8 px-2 text-primary-dark hover:text-card hover:bg-primary-dark"
                                                onClick={() => {
                                                    setSelectSync(segment.name);
                                                    setIsOpen(true);
                                                }}
                                            >
                                                <RefreshCw className="h-4 w-4 mr-1" />
                                                <span>Đồng bộ</span>
                                            </Button>
                                        </div>
                                    ) : (
                                        // Tooltip nếu không có khách hàng
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="absolute inset-0 z-10" />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-background" side="top" align="center" sideOffset={8}>
                                                Không có khách hàng trong phân khúc
                                            </TooltipContent>
                                        </Tooltip>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Days section */}
                <Card className="col-span-3 gap-4 bg-background p-4">
                    <Tabs value={tab} onValueChange={setTab}>
                        <TabsList className="flex justify-between justify-center mb-4 w-full">
                            <div className="flex items-center space-x-2">
                                <TabsTrigger value="R">R</TabsTrigger>
                                <TabsTrigger value="F">F</TabsTrigger>
                                <TabsTrigger value="M">M</TabsTrigger>
                            </div>
                        </TabsList>

                        <TabsContent value="R">
                            {formattedData.map((segment) => (
                                <div key={segment.name} className="flex items-center justify-between py-1 border-b text-sm">
                                    <div className="flex items-center gap-5">
                                        <div className="w-4 h-4" style={{ backgroundColor: generateColor[segment.name] }} />
                                        <ScoreBar value={segment.r} color={generateColor[segment.name]} />
                                    </div>
                                    <label>{segment.r}</label>
                                </div>
                            ))}
                        </TabsContent>

                        <TabsContent value="F">
                            {formattedData.map((segment) => (
                                <div key={segment.name} className="flex items-center justify-between py-1 border-b text-sm">
                                    <div className="flex items-center gap-5">
                                        <div className="w-4 h-4" style={{ backgroundColor: generateColor[segment.name] }} />
                                        <ScoreBar value={segment.f} color={generateColor[segment.name]} />
                                    </div>
                                    <label>{segment.f}</label>
                                </div>
                            ))}
                        </TabsContent>

                        <TabsContent value="M">
                            {formattedData.map((segment) => (
                                <div key={segment.name} className="flex items-center justify-between py-1 border-b text-sm">
                                    <div className="flex items-center gap-5">
                                        <div className="w-4 h-4" style={{ backgroundColor: generateColor[segment.name] }} />
                                        <ScoreBar value={segment.m} color={generateColor[segment.name]} />
                                    </div>
                                    <label>{segment.m}</label>
                                </div>
                            ))}
                        </TabsContent>
                    </Tabs>
                </Card>
            </div>
            <StrategyDialog
                selectedSegment={selectedSegment}
                onClose={() => setSelectedSegment(null)}
            />
            <SyncSettingsDialog open={isOpen} onClose={() => setIsOpen(false)} inputData={rawData} selectBefore={selectSync} />
        </div>
    )
}
