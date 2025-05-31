import { DashboardShell } from "@/components/layout/DashboardShell"
import { AdminTable } from "@/components/blocks/Auth/admin-table"
import { InviteAdminDialog } from "@/components/blocks/Auth/invite-admin-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { Admin, InviteAdminData } from "@/types/auth"
import { useToast } from "@/components/ui/use-toast"

export default function Authentication() {
    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
    const { toast } = useToast()

    // Mock data for testing
    const [admins, setAdmins] = useState<Admin[]>([
        {
            id: 1,
            email: "john.doe@example.com",
            first_name: "John",
            last_name: "Doe",
            created_at: "2024-03-15T10:00:00Z",
            updated_at: "2024-03-15T10:00:00Z"
        },
        {
            id: 2,
            email: "jane.smith@example.com",
            first_name: "Jane",
            last_name: "Smith",
            created_at: "2024-03-15T11:00:00Z",
            updated_at: "2024-03-15T11:00:00Z"
        }
    ])

    const handleInvite = async (data: InviteAdminData) => {
        try {
            // TODO: Implement API call to invite admin
            console.log("Inviting admin:", data)
            
            // Mock adding new admin
            const newAdmin: Admin = {
                id: admins.length + 1,
                email: data.email,
                first_name: data.first_name,
                last_name: data.last_name,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
            setAdmins([...admins, newAdmin])

            toast({
                title: "Success",
                description: "Admin has been invited successfully",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to invite admin",
                variant: "destructive",
            })
        }
    }

    const handleDelete = async (id: number) => {
        try {
            // TODO: Implement API call to delete admin
            console.log("Deleting admin:", id)
            
            // Mock deleting admin
            setAdmins(admins.filter(admin => admin.id !== id))

            toast({
                title: "Success",
                description: "Admin has been deleted successfully",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete admin",
                variant: "destructive",
            })
        }
    }

    return (
        <DashboardShell>
            <div className="py-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold">Authentication</h1>
                    <Button onClick={() => setIsInviteDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Invite Admin
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-6">
                        <AdminTable admins={admins} onDelete={handleDelete} />
                    </CardContent>
                </Card>

                <InviteAdminDialog
                    open={isInviteDialogOpen}
                    onOpenChange={setIsInviteDialogOpen}
                    onInvite={handleInvite}
                />
            </div>
        </DashboardShell>
    )
}