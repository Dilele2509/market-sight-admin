"use client"

import { addMonths, format } from "date-fns"
import { vi } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useLifeContext } from "@/context/LifecycleContext"

function DateRangePicker() {
    const { startDate, setStartDate, endDate, setEndDate } = useLifeContext()

    // Set default values on initial render
    useEffect(() => {
        // If endDate is not set, default to now
        if (!endDate) {
            const now = new Date()
            setEndDate(now)
        }

        // If startDate is not set, default to one month ago
        if (!startDate) {
            const now = new Date()
            const twoMonthAgo = addMonths(now, -3)
            setStartDate(twoMonthAgo)
        }
    }, [startDate, endDate, setStartDate, setEndDate])

    // Format dates for display
    const formatDate = (date: Date | null) => {
        if (!date) return ""
        return format(date, "d MMMM, yyyy", { locale: vi })
    }

    // Handle date selection
    const handleStartDateSelect = (date: Date | null) => {
        if (!date) return
        // Set time to beginning of day
        const newDate = new Date(date)
        newDate.setHours(0, 0, 0, 0)
        setStartDate(newDate)
    }

    const handleEndDateSelect = (date: Date | null) => {
        if (!date) return
        // Set time to end of day
        const newDate = new Date(date)
        newDate.setHours(23, 59, 59, 999)
        setEndDate(newDate)
    }

    return (
        <div className="flex items-center gap-2 text-sm">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className={cn("h-8 px-2 text-xs", !startDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        {startDate ? formatDate(startDate) : "Start"}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-background" align="start">
                    <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={handleStartDateSelect}
                        initialFocus
                        defaultMonth={startDate || undefined}
                        locale={vi}
                    />
                </PopoverContent>
            </Popover>

            <span className="text-muted-foreground">đến</span>

            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className={cn("h-8 px-2 text-xs", !endDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        {endDate ? formatDate(endDate) : "End"}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-background" align="end">
                    <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={handleEndDateSelect}
                        initialFocus
                        defaultMonth={endDate || undefined}
                        locale={vi}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default DateRangePicker
