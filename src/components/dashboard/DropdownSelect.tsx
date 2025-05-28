import { dashboardDataInterface } from '@/pages/Index';
import { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface MonthlyDetailDropdownProps {
    data: dashboardDataInterface[];
    currentData: dashboardDataInterface;
    resetCurrentData: React.Dispatch<React.SetStateAction<dashboardDataInterface>>;
}

export function MonthlyDetailDropdown({ data, currentData, resetCurrentData }: MonthlyDetailDropdownProps) {
    const getMonthYear = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.toLocaleString('vi-VN', { month: 'long' })} ${date.getFullYear()}`;
    };

    const [selectedMonth, setSelectedMonth] = useState<string>(getMonthYear(currentData.period.end_date));

    const handleChange = (value: string) => {
        setSelectedMonth(value);
        const matchedItem = data.find(item =>
            getMonthYear(item.period.end_date) === value
        );
        if (matchedItem) {
            resetCurrentData(matchedItem);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <label className="min-w-fit text-sm font-medium text-card-foreground">
                Báo cáo theo:
            </label>
            <Select value={selectedMonth} onValueChange={handleChange}>
                <SelectTrigger className="w-[200px] bg-card">
                    <SelectValue placeholder="Select a Month" />
                </SelectTrigger>
                <SelectContent className='bg-card'>
                    {data.map((item, index) => {
                        const monthYear = getMonthYear(item.period.end_date);
                        return (
                            <SelectItem className='hover:bg-background' key={index} value={monthYear}>
                                {monthYear}
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>
        </div>
    );
}
