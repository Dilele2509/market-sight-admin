import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { PendingAccount } from "@/types/user";
import { ButtonLoading } from "@/components/ui/loading";

interface PendingTableProps {
  users: PendingAccount[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  onUserSelect: (user: PendingAccount) => void;
  onAccept: (verifyId: number, email: string, token: string) => void;
  onDecline: (verifyId: number, email: string, userId: number) => void;
  getRoleName: (roleId: number) => string | null;
  removingUsers: Set<number>;
}

const ROWS_PER_PAGE = 7;

export function PendingTable({
  users,
  currentPage,
  setCurrentPage,
  onUserSelect,
  onAccept,
  onDecline,
  getRoleName,
  removingUsers
}: PendingTableProps) {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users
            .slice(
              (currentPage - 1) * ROWS_PER_PAGE,
              currentPage * ROWS_PER_PAGE
            )
            .map((user, index) => (
              <TableRow
                key={user.verify_id}
                className="transition-colors hover:bg-background cursor-pointer"
                style={{
                  transform: removingUsers.has(user.verify_id) 
                    ? `translateX(${user.action === 'accept' ? '100%' : '-100%'})` 
                    : 'translateX(0)',
                  opacity: removingUsers.has(user.verify_id) ? 0 : 1,
                  backgroundColor: removingUsers.has(user.verify_id) 
                    ? (user.action === 'accept' ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)') 
                    : 'transparent',
                  transition: 'all 0.5s ease-in-out'
                }}
                onClick={() => onUserSelect(user)}
              >
                <TableCell className="font-medium">
                  {(currentPage - 1) * ROWS_PER_PAGE + index + 1}
                </TableCell>
                <TableCell className="truncate">{user.first_name}</TableCell>
                <TableCell className="truncate">{user.last_name}</TableCell>
                <TableCell className="truncate">{user.email}</TableCell>
                <TableCell>{getRoleName(user.role_id)}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-[100px] bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700 hover:border-green-300 transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      user.action = 'accept';
                      onAccept(user.verify_id, user.email, user.token);
                    }}
                    disabled={removingUsers.has(user.verify_id)}
                  >
                    {removingUsers.has(user.verify_id) && user.action === 'accept' ? (
                      <ButtonLoading />
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        <span>Accept</span>
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-[100px] bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700 hover:border-red-300 transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      user.action = 'decline';
                      onDecline(user.verify_id, user.email, user.user_id);
                    }}
                    disabled={removingUsers.has(user.verify_id)}
                  >
                    {removingUsers.has(user.verify_id) && user.action === 'decline' ? (
                      <ButtonLoading />
                    ) : (
                      <>
                        <X className="mr-2 h-4 w-4" />
                        <span>Decline</span>
                      </>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {Math.ceil(users.length / ROWS_PER_PAGE) > 1 && (
        <Pagination className="justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {Array.from(
              { length: Math.ceil(users.length / ROWS_PER_PAGE) },
              (_, i) => i + 1
            ).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(
                  Math.min(Math.ceil(users.length / ROWS_PER_PAGE), currentPage + 1)
                )}
                className={
                  currentPage === Math.ceil(users.length / ROWS_PER_PAGE)
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
} 