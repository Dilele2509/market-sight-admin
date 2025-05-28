import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Building2, Calendar, Clock, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PendingAccount } from "@/types/user";
import { ButtonLoading } from "@/components/ui/loading";

interface PendingDialogProps {
  user: PendingAccount | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: (verifyId: number, email: string, token: string) => void;
  onDecline: (verifyId: number, email: string, userId: number) => void;
  getRoleName: (roleId: number) => string | null;
  getBusinessName: (businessId: number) => string;
  formatDate: (date: string) => string;
  removingUsers: Set<number>;
}

export function PendingDialog({
  user,
  open,
  onOpenChange,
  onAccept,
  onDecline,
  getRoleName,
  getBusinessName,
  formatDate,
  removingUsers
}: PendingDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight">Account Details</DialogTitle>
            <p className="text-muted-foreground">Review pending account information</p>
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

          <Separator />

          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700 hover:border-green-300"
              onClick={() => {
                user.action = 'accept';
                onAccept(user.verify_id, user.email, user.token);
                onOpenChange(false);
              }}
              disabled={removingUsers.has(user.verify_id)}
            >
              {removingUsers.has(user.verify_id) ? (
                <ButtonLoading className="mr-2" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              Accept
            </Button>
            <Button
              variant="outline"
              className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700 hover:border-red-300"
              onClick={() => {
                user.action = 'decline';
                onDecline(user.verify_id, user.email, user.user_id);
                onOpenChange(false);
              }}
              disabled={removingUsers.has(user.verify_id)}
            >
              {removingUsers.has(user.verify_id) ? (
                <ButtonLoading className="mr-2" />
              ) : (
                <X className="mr-2 h-4 w-4" />
              )}
              Decline
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 