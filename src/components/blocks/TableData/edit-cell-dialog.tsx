"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EditCellDialogProps {
    isOpen: boolean
    onClose: () => void
    initialValue: string
    onSave: (value: string) => void
    column: string
}

export function EditCellDialog({ isOpen, onClose, initialValue, onSave, column }: EditCellDialogProps) {
    const [value, setValue] = useState(initialValue)

    const handleSave = () => {
        onSave(value)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit {column}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="cell-value">Value</Label>
                        <Input id="cell-value" value={value} onChange={(e) => setValue(e.target.value)} className="font-mono" />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSave}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
