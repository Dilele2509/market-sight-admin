import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InviteAdminData } from "@/types/auth"
import { ButtonLoading } from "@/components/ui/loading"

interface InviteAdminDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onInvite: (data: InviteAdminData) => Promise<void>
}

export function InviteAdminDialog({ open, onOpenChange, onInvite }: InviteAdminDialogProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("")

    const generateRandomPassword = () => {
        const length = 12
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
        let password = ""
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length)
            password += charset[randomIndex]
        }
        return password
    }

    const extractNameFromEmail = (email: string) => {
        const username = email.split("@")[0]
        const parts = username.split(/[._-]/)
        const firstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
        const lastName = parts.length > 1 
            ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1)
            : "User"
        return { firstName, lastName }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return

        setIsLoading(true)
        try {
            const { firstName, lastName } = extractNameFromEmail(email)
            const password = generateRandomPassword()

            await onInvite({
                email,
                first_name: firstName,
                last_name: lastName,
                password
            })

            onOpenChange(false)
            setEmail("")
        } catch (error) {
            console.error("Error inviting admin:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite Admin</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email address"
                            required
                        />
                    </div>
                    <DialogFooter>
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
                                "Invite"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
} 