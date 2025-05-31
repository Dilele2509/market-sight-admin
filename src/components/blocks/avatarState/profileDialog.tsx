import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  User,
  Mail,
  Building2,
  Calendar,
  Clock,
  Shield,
  LogOut,
  Save,
  Camera
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { axiosPrivate } from "@/API/axios";

interface ProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: {
        first_name: string;
        last_name: string;
        email: string;
        role_id: number;
        business_id: number;
        created_at: string;
        updated_at: string;
    };
}

export function ProfileDialog({ open, onOpenChange, user }: ProfileDialogProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Update form data when user prop changes
        setFormData({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
        });
    }, [user]);

    const handleLogout = () => {
        try {
            localStorage.removeItem("token");
            navigate("/login");
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error("Failed to logout");
        }
    };

    const handleSave = async () => {
        try {
            setIsLoading(true);
            const response = await axiosPrivate.post("/update-profile", formData);
            if (response.status === 200) {
                toast.success("Profile updated successfully");
                setIsEditing(false);
                // Update the parent component's user data
                onOpenChange(false);
            }
        } catch (error: any) {
            console.error("Error updating profile:", error);
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    const getRoleName = (roleId: number) => {
        switch (roleId) {
            case 1:
                return "Administrator";
            case 2:
                return "Data Team";
            case 3:
                return "Marketing Team";
            default:
                return "Unknown Role";
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleAvatarClick = () => {
        toast.info("Avatar upload feature coming soon!");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] p-0">
                <div className="relative h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                    <div className="absolute -bottom-16 left-6 p-1 bg-background rounded-full shadow-lg">
                        <div className="relative w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-3xl font-bold text-white">
                            {user.first_name[0]}{user.last_name[0]}
                        </div>
                    </div>
                </div>

                <div className="pt-20 px-6 pb-6">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold tracking-tight">
                            {isEditing ? "Edit Profile" : "Profile Information"}
                        </DialogTitle>
                    </DialogHeader>

                    <ScrollArea className="max-h-[400px] pr-6 -mr-6">
                        <div className="space-y-6 mt-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <div className="relative">
                                        <Input
                                            id="firstName"
                                            value={formData.first_name}
                                            onChange={(e) =>
                                                setFormData({ ...formData, first_name: e.target.value })
                                            }
                                            disabled={!isEditing}
                                            className="pl-9"
                                        />
                                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <div className="relative">
                                        <Input
                                            id="lastName"
                                            value={formData.last_name}
                                            onChange={(e) =>
                                                setFormData({ ...formData, last_name: e.target.value })
                                            }
                                            disabled={!isEditing}
                                            className="pl-9"
                                        />
                                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({ ...formData, email: e.target.value })
                                        }
                                        disabled={!isEditing}
                                        className="pl-9"
                                    />
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                </div>
                            </div>

                            <Separator />

                            <div className="grid gap-4">
                                <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg transition-colors hover:bg-muted/80">
                                    <div className="p-2 bg-primary/10 rounded-full">
                                        <Shield className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Role</p>
                                        <p className="text-sm text-muted-foreground">
                                            {getRoleName(user.role_id)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg transition-colors hover:bg-muted/80">
                                    <div className="p-2 bg-primary/10 rounded-full">
                                        <Building2 className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Business</p>
                                        <p className="text-sm text-muted-foreground">RetailCorp</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg transition-colors hover:bg-muted/80">
                                        <div className="p-2 bg-primary/10 rounded-full">
                                            <Calendar className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">Created</p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatDate(user.created_at)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg transition-colors hover:bg-muted/80">
                                        <div className="p-2 bg-primary/10 rounded-full">
                                            <Clock className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">Updated</p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatDate(user.updated_at)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>

                    <div className="flex justify-end gap-4 mt-6">
                        <Button
                            variant="outline"
                            className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700 hover:border-red-300"
                            onClick={handleLogout}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                        {isEditing ? (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormData({
                                            first_name: user.first_name,
                                            last_name: user.last_name,
                                            email: user.email,
                                        });
                                    }}
                                    className="bg-muted hover:bg-muted/80"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={isLoading}
                                    className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700 hover:border-green-300"
                                >
                                    {isLoading ? (
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    ) : (
                                        <Save className="mr-2 h-4 w-4" />
                                    )}
                                    Save Changes
                                </Button>
                            </>
                        ) : (
                            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
