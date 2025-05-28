import { TrendingUpIcon, TrendingDownIcon, UsersIcon, DollarSignIcon } from 'lucide-react';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from '../ui/card';
import { dashboardDataInterface } from '@/pages/Index';

interface QuickInsightsCardProps {
    data: dashboardDataInterface;
}

export function QuickInsightsCard({ data }: QuickInsightsCardProps) {
    const formatPercentageChange = (change: number) => `${change.toFixed(2)}%`;
    const formatIncreaseOrDecrease = (change: number) => (change > 0 ? 'Increased' : 'Decreased');

    const getChangeIconAndBg = (change: number, Icon: React.ElementType) => {
        return {
            icon: change > 0 ? <TrendingUpIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> : <TrendingDownIcon className="h-4 w-4 text-rose-600 dark:text-rose-400" />,
            bgClass: change > 0 ? 'bg-emerald-100 dark:bg-emerald-900' : 'bg-rose-100 dark:bg-rose-900',
        };
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Insights</CardTitle>
                <CardDescription>Key takeaways from {new Date(data.period.start_date).toLocaleString('en-us', { month: 'long', year: 'numeric' })}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Orders */}
                    <div className="flex items-start gap-2">
                        <div className={`rounded-full p-1.5 ${getChangeIconAndBg(data.changes.orders, TrendingUpIcon).bgClass}`}>
                            {getChangeIconAndBg(data.changes.orders, TrendingUpIcon).icon}
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">{`Orders ${formatIncreaseOrDecrease(data.changes.orders)} by ${formatPercentageChange(data.changes.orders)}`}</p>
                            <p className="text-xs text-muted-foreground">Strong growth in order volume</p>
                        </div>
                    </div>

                    {/* AOV */}
                    <div className="flex items-start gap-2">
                        <div className={`rounded-full p-1.5 ${getChangeIconAndBg(data.changes.aov, TrendingUpIcon).bgClass}`}>
                            {getChangeIconAndBg(data.changes.aov, TrendingUpIcon).icon}
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">{`AOV ${formatIncreaseOrDecrease(data.changes.aov)} by ${formatPercentageChange(data.changes.aov)}`}</p>
                            <p className="text-xs text-muted-foreground">Significant drop in average order value</p>
                        </div>
                    </div>

                    {/* Unique Customers */}
                    <div className="flex items-start gap-2">
                        <div className="rounded-full bg-emerald-100 p-1.5 dark:bg-emerald-900">
                            <UsersIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">{`Customer base grew by ${formatPercentageChange(data.changes.unique_customers)}`}</p>
                            <p className="text-xs text-muted-foreground">Healthy growth in unique customers</p>
                        </div>
                    </div>

                    {/* GMV */}
                    <div className="flex items-start gap-2">
                        <div className={`rounded-full p-1.5 ${getChangeIconAndBg(data.changes.gmv, DollarSignIcon).bgClass}`}>
                            {getChangeIconAndBg(data.changes.gmv, DollarSignIcon).icon}
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">{`GMV ${formatIncreaseOrDecrease(data.changes.gmv)} by ${formatPercentageChange(data.changes.gmv)}`}</p>
                            <p className="text-xs text-muted-foreground">Overall revenue decline despite more orders</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
