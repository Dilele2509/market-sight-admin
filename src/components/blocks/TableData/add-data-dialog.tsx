import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TableType, TableData, TABLE_CONFIG } from "@/types/table";
import { ButtonLoading } from "@/components/ui/loading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AddDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: TableType;
  onAdd: (data: Partial<TableData>) => Promise<void>;
}

export function AddDataDialog({ open, onOpenChange, type, onAdd }: AddDataDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<TableData>>({});
  const config = TABLE_CONFIG[type];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onAdd(formData);
      onOpenChange(false);
      setFormData({});
    } catch (error) {
      console.error("Error adding data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (key: string, value: string | number | Date) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getInputType = (key: string) => {
    if (key.includes('_date') || key.includes('_at')) {
      return 'date';
    }
    if (key.includes('price') || key.includes('amount') || key.includes('cost')) {
      return 'number';
    }
    if (key === 'gender') {
      return 'select';
    }
    if (key === 'payment_method') {
      return 'select';
    }
    if (key === 'store_type') {
      return 'select';
    }
    return 'text';
  };

  const renderInput = (column: { key: string; label: string }) => {
    const type = getInputType(column.key);
    const value = formData[column.key as keyof TableData];

    switch (type) {
      case 'date':
        const dateValue = typeof value === 'string' ? value : '';
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateValue && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateValue ? format(new Date(dateValue), "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateValue ? new Date(dateValue) : undefined}
                onSelect={(date) => handleChange(column.key, date?.toISOString() || '')}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      case 'select':
        let options: { value: string; label: string }[] = [];
        if (column.key === 'gender') {
          options = [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' }
          ];
        } else if (column.key === 'payment_method') {
          options = [
            { value: 'cash', label: 'Cash' },
            { value: 'credit_card', label: 'Credit Card' },
            { value: 'debit_card', label: 'Debit Card' },
            { value: 'bank_transfer', label: 'Bank Transfer' }
          ];
        } else if (column.key === 'store_type') {
          options = [
            { value: 'retail', label: 'Retail' },
            { value: 'wholesale', label: 'Wholesale' },
            { value: 'online', label: 'Online' }
          ];
        }
        const selectValue = typeof value === 'string' ? value : '';
        return (
          <Select
            value={selectValue}
            onValueChange={(value) => handleChange(column.key, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${column.label}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'number':
        const numberValue = typeof value === 'number' ? value : '';
        return (
          <Input
            id={column.key}
            type="number"
            value={numberValue}
            onChange={(e) => handleChange(column.key, e.target.value ? parseFloat(e.target.value) : '')}
            required
            className="font-mono"
          />
        );

      default:
        const textValue = typeof value === 'string' ? value : '';
        return (
          <Input
            id={column.key}
            value={textValue}
            onChange={(e) => handleChange(column.key, e.target.value)}
            required
          />
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New {config.title}</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new {config.title.toLowerCase()} record.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {config.columns
              .filter(column => !column.key.includes('_id') && !column.key.includes('_at'))
              .map(column => (
                <div key={column.key} className="space-y-2">
                  <Label htmlFor={column.key}>{column.label}</Label>
                  {renderInput(column)}
                </div>
              ))}
          </div>
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <ButtonLoading />
              ) : (
                "Add"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 