import type React from "react"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MetricCardProps {
  title: string
  value: number
  change: number
  icon: React.ReactNode
  isCurrency?: boolean
  precision?: number
}

export function MetricCard({ title, value, change, icon, isCurrency = false, precision = 2 }: MetricCardProps) {
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    }).format(value)
  }

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`
  }

  // Format number with specified precision
  const formatNumber = (value: number) => {
    return value.toFixed(precision)
  }

  const formattedValue = isCurrency ? formatCurrency(value) : formatNumber(value)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedValue}</div>
        <div className="flex items-center text-xs mt-1">
          {change >= 0 ? (
            <ArrowUpIcon className="mr-1 h-4 w-4 text-emerald-500" />
          ) : (
            <ArrowDownIcon className="mr-1 h-4 w-4 text-rose-500" />
          )}
          <span className={change >= 0 ? "text-emerald-500" : "text-rose-500"}>{formatPercentage(change)}</span>
          <span className="text-muted-foreground ml-1">so với tháng trước</span>
        </div>
      </CardContent>
    </Card>
  )
}
