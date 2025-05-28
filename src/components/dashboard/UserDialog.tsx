import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Building2, Calendar, Clock } from "lucide-react";
import { User } from "@/types/user";

interface UserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  getRoleName: (roleId: number) => string | null;
  getBusinessName: (businessId: number) => string;
  formatDate: (date: string) => string;
}

export function UserDialog({
  user,
  open,
  onOpenChange,
  getRoleName,
  getBusinessName,
  formatDate
}: UserDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight">User Details</DialogTitle>
            <p className="text-muted-foreground">Verified account information</p>
          </DialogHeader>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-semibold tracking-tight">
                {user.first_name} {user.last_name}
              </h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <Badge variant="outline" className="capitalize">
              {getRoleName(user.role_id)}
            </Badge>
          </div>

          <Separator />

          <div className="grid gap-4">
            <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg transition-colors hover:bg-muted/80">
              <div className="p-2 bg-primary/10 rounded-full">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Business</p>
                <p className="text-sm text-muted-foreground">{getBusinessName(user.business_id)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg transition-colors hover:bg-muted/80">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">{formatDate(user.created_at)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg transition-colors hover:bg-muted/80">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Updated</p>
                  <p className="text-sm text-muted-foreground">{formatDate(user.updated_at)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 