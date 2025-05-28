"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function BusinessGuideModal() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    type="button"
                    className="text-primary underline underline-offset-4 hover:text-primary/80 text-sm"
                >
                    Click here for guidance
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Can’t find your business?</DialogTitle>
                    <DialogDescription>
                        If your business is not listed, it might not be registered in our system yet.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 text-sm text-muted-foreground">
                    <p>To register a new business:</p>
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Go to the <strong>Business Registration</strong> page.</li>
                        <li>Fill in all required information, including a confirmation email address.</li>
                        <li>Contact an authorized person in your business to check their inbox for the confirmation email.</li>
                    </ol>
                    <p>
                        Once the business is confirmed, you can return to this form and select your business from the dropdown.
                    </p>
                </div>
                <div className="pt-4">
                    <Button asChild className="w-full">
                        <a href="/register">Go to Business Registration</a>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
